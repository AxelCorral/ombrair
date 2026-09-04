"""
Capteur extérieur Ombrair — rendus de contrôle.

    blender --background --python docs/3d/render_capteur_exterieur.py -- <racine>

Produit les huit vues demandées par le brief (face, dos, gauche, droite,
dessus, dessous, perspective, éclatée) plus l'image de repli de la
visionneuse.

Les rendus vont dans `audit/3d/` et non dans `public/` : ce sont des pièces
de VÉRIFICATION, pas des assets du site. Treize mégaoctets de contrôles
n'ont rien à faire dans ce qui est déployé. Seule l'image de repli, qui sert
réellement à la page produit, atterrit dans `public/models/`. Les rendus servent à JUGER le modèle, pas à le vendre :
éclairage de studio doux, fond neutre, aucune mise en scène.

Moteur : EEVEE. Cycles donnerait un peu mieux sur les congés, mais dix vues
en ray tracing coûtent des minutes pour un gain invisible à cette taille, et
l'objet n'a ni verre ni métal poli.
"""

import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from build_capteur_exterieur import construire, mm  # noqa: E402

LARGEUR = 1400
HAUTEUR = 1050

# Distance de caméra : assez loin pour éviter la déformation de perspective
# sur un objet de 80 mm, assez près pour qu'il remplisse le cadre.
RAYON = mm(260)

VUES = {
    "01-face":       (0.0, -1.0, 0.0),
    "02-dos":        (0.0, 1.0, 0.0),
    "03-gauche":     (-1.0, 0.0, 0.0),
    "04-droite":     (1.0, 0.0, 0.0),
    "05-dessus":     (0.0, -0.001, 1.0),
    "06-dessous":    (0.0, -0.001, -1.0),
    "07-perspective": (-0.72, -1.0, 0.55),
    "09-trois-quarts-droit": (0.85, -1.0, 0.45),
}


def configurer_rendu() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE_NEXT"
    scene.render.resolution_x = LARGEUR
    scene.render.resolution_y = HAUTEUR
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.view_settings.view_transform = "Standard"
    # Chaux (#f4f1e9) est déjà très claire : sans cette correction, elle sort
    # en blanc pur et le boîtier perd sa matière. Le réglage se fait ici, une
    # fois, plutôt qu'en assombrissant le matériau — la couleur de la charte
    # reste exacte dans le fichier.
    scene.view_settings.exposure = -1.15

    if hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 64

    # Fond : la Chaux du site, très légèrement assombrie pour que le boîtier
    # Chaux s'en détache. Le produit doit rester la seule chose regardée.
    monde = bpy.data.worlds.new("Studio")
    monde.use_nodes = True
    monde.node_tree.nodes["Background"].inputs[0].default_value = (0.74, 0.73, 0.70, 1.0)
    monde.node_tree.nodes["Background"].inputs[1].default_value = 0.55
    scene.world = monde


def poser_lumieres() -> None:
    """Trois sources : principale, adoucissante, contre-jour. Rien de plus."""
    # Énergies divisées par ~4 par rapport à la V1 : la Chaux (#f4f1e9) est
    # déjà très claire, et le premier réglage la sortait en blanc pur — la
    # grille et le marquage s'y noyaient complètement.
    for nom, position, energie, taille in [
        ("cle", (mm(180), mm(-220), mm(240)), 3.2, mm(300)),
        ("remplissage", (mm(-240), mm(-160), mm(60)), 1.1, mm(400)),
        ("contre", (mm(-60), mm(260), mm(200)), 1.6, mm(250)),
    ]:
        lampe = bpy.data.lights.new(nom, type="AREA")
        lampe.energy = energie
        lampe.size = taille
        obj = bpy.data.objects.new(nom, lampe)
        obj.location = position
        bpy.context.collection.objects.link(obj)
        direction = Vector((0, 0, 0)) - Vector(position)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def poser_camera(direction) -> bpy.types.Object:
    cam_data = bpy.data.cameras.new("camera")
    cam_data.lens = 85.0  # téléobjectif léger : peu de déformation
    cam = bpy.data.objects.new("camera", cam_data)
    bpy.context.collection.objects.link(cam)
    bpy.context.scene.camera = cam

    vecteur = Vector(direction).normalized() * RAYON
    cam.location = vecteur
    cam.rotation_euler = (-vecteur).to_track_quat("-Z", "Y").to_euler()
    return cam


def rendre(chemin: str) -> None:
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    bpy.context.scene.render.filepath = chemin
    bpy.ops.render.render(write_still=True)
    print(f"[ombrair] rendu : {os.path.basename(chemin)}")


def cadrer_sur_tout(cam: bpy.types.Object, marge: float = 1.18) -> None:
    """Recule la caméra jusqu'à ce que toute la scène tienne dans le cadre."""
    bpy.context.view_layer.update()
    points = []
    for obj in bpy.context.scene.objects:
        if obj.type != "MESH":
            continue
        for coin in obj.bound_box:
            points.append(obj.matrix_world @ Vector(coin))
    if not points:
        return
    centre = sum(points, Vector()) / len(points)
    rayon = max((p - centre).length for p in points)

    fov = bpy.context.scene.camera.data.angle
    distance = (rayon * marge) / math.tan(fov / 2)
    direction = (cam.location - centre).normalized()
    cam.location = centre + direction * distance
    cam.rotation_euler = (centre - cam.location).to_track_quat("-Z", "Y").to_euler()


def main() -> None:
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    racine = args[0] if args else os.getcwd()
    sortie = os.path.join(racine, "audit/3d/capteur-exterieur")

    # ── Vues du modèle assemblé
    for nom, direction in VUES.items():
        construire(eclate=False)
        configurer_rendu()
        poser_lumieres()
        cam = poser_camera(direction)
        cadrer_sur_tout(cam)
        rendre(os.path.join(sortie, f"{nom}.png"))

    # ── Vue éclatée
    construire(eclate=True)
    configurer_rendu()
    poser_lumieres()
    # Angle plus latéral que pour les autres vues : à quasi-face, les strates
    # se voyaient de trois quarts arrière et la carte se lisait comme une
    # simple plaque verte, ses composants invisibles. En tournant vers la
    # gauche, chaque plan montre sa face.
    cam = poser_camera((-0.98, -0.92, 0.46))
    cadrer_sur_tout(cam, marge=1.12)
    rendre(os.path.join(sortie, "08-eclatee.png"))

    # ── Image de repli de la visionneuse : même pose que la caméra du viewer,
    # pour que le passage 3D → repli ne saute pas aux yeux.
    #
    # Rendue en 800 × 600 et non en 1400 × 1050 : `<model-viewer>` l'affiche
    # aussi comme affiche PENDANT le chargement du modèle, elle est donc sur
    # le chemin critique. À pleine résolution elle pesait 828 ko, soit neuf
    # fois le GLB qu'elle est censée faire patienter.
    construire(eclate=False)
    configurer_rendu()
    bpy.context.scene.render.resolution_x = 800
    bpy.context.scene.render.resolution_y = 600
    bpy.context.scene.render.film_transparent = True
    poser_lumieres()
    cam = poser_camera((-0.62, -1.0, 0.42))
    cadrer_sur_tout(cam, marge=1.30)
    rendre(os.path.join(racine, "public/models/capteur-exterieur-ombrair-fallback.png"))

    print("[ombrair] rendus terminés")


if __name__ == "__main__":
    main()
