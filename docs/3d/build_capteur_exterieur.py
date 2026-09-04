"""
Capteur extérieur Ombrair — construction du modèle 3D.

Script Blender exécutable en arrière-plan :

    blender --background --python docs/3d/build_capteur_exterieur.py

Il reconstruit le modèle **entièrement** à chaque exécution, à partir des cotes
de `capteur-exterieur-ombrair-spec.md`. C'est volontaire : le `.blend` est un
livrable, pas une source qu'on retouche à la main. Une cote se change ici, et
tout le reste suit — boîtier, grille, implantation interne, vue éclatée.

UNITÉS. 1 unité Blender = 1 mètre. Les cotes du produit sont écrites en
millimètres et converties par `mm()`, ce qui garde le script lisible et le
`.glb` à l'échelle réelle attendue par `<model-viewer>`.

REPÈRE. X = largeur (80 mm), Y = profondeur (26 mm), Z = hauteur (60 mm).
L'origine est au centre du boîtier. La face avant — celle que montre la
planche de charte — regarde vers -Y.
"""

import math
import os
import sys

import bpy
import bmesh
from mathutils import Vector

# ─────────────────────────────────────────────────────────────────────────────
# Cotes — voir docs/3d/capteur-exterieur-ombrair-spec.md
# ─────────────────────────────────────────────────────────────────────────────

def mm(valeur: float) -> float:
    """Millimètres → unités Blender (mètres)."""
    return valeur / 1000.0


BOITIER_L = 80.0      # largeur
BOITIER_H = 60.0      # hauteur
BOITIER_P = 26.0      # profondeur
CONGE = 3.0           # rayon des congés verticaux
EPAISSEUR = 2.0       # épaisseur de coque
JOINT_Y = 10.0        # ligne de joint, mesurée depuis le fond

# Grille de mesure : 6 fentes, cadran supérieur gauche
GRILLE_N = 6
GRILLE_L = 30.0
GRILLE_FENTE_H = 1.6
GRILLE_PAS = 3.2
GRILLE_CX = -18.0     # centre en X
GRILLE_CZ = 12.0      # centre en Z

# Fenêtre optique : cadran supérieur droit
OPTIQUE_D = 7.0
OPTIQUE_X = 24.0
OPTIQUE_Z = 15.0

# Marquage : cadran inférieur gauche, 4 mm de haut (cote de la planche)
MARQUE_H = 4.0
MARQUE_X = -22.0
MARQUE_Z = -17.0

PLATINE_L = 70.0
PLATINE_H = 50.0
PLATINE_P = 3.0

# Couleurs de la charte Ombrair
CHAUX = (0.957, 0.945, 0.914, 1.0)
PERSIENNE = (0.200, 0.400, 0.353, 1.0)
NUIT = (0.086, 0.114, 0.137, 1.0)


# ─────────────────────────────────────────────────────────────────────────────
# Utilitaires
# ─────────────────────────────────────────────────────────────────────────────

def purger_scene() -> None:
    """Repart d'une scène vide, y compris des données orphelines."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for bloc in (bpy.data.meshes, bpy.data.materials, bpy.data.objects):
        for element in list(bloc):
            bloc.remove(element)


def srgb_vers_lineaire(c: float) -> float:
    """Blender travaille en linéaire ; la charte donne des valeurs sRGB."""
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def materiau(nom: str, couleur, rugosite: float, metal: float = 0.0,
             transmission: float = 0.0) -> bpy.types.Material:
    mat = bpy.data.materials.new(nom)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    lineaire = tuple(srgb_vers_lineaire(v) for v in couleur[:3]) + (couleur[3],)
    bsdf.inputs["Base Color"].default_value = lineaire
    bsdf.inputs["Roughness"].default_value = rugosite
    bsdf.inputs["Metallic"].default_value = metal
    if transmission and "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = transmission
    return mat


def bloc(nom: str, largeur: float, hauteur: float, profondeur: float,
         centre=(0.0, 0.0, 0.0)) -> bpy.types.Object:
    """Pavé droit centré, coté en millimètres."""
    maillage = bpy.data.meshes.new(nom)
    obj = bpy.data.objects.new(nom, maillage)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector((mm(largeur), mm(profondeur), mm(hauteur))),
                    verts=bm.verts)
    bmesh.ops.translate(
        bm, vec=Vector((mm(centre[0]), mm(centre[1]), mm(centre[2]))),
        verts=bm.verts)
    bm.to_mesh(maillage)
    bm.free()
    return obj


def cylindre(nom: str, diametre: float, longueur: float, centre,
             axe: str = "Y") -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=48, radius=mm(diametre / 2), depth=mm(longueur),
        location=(mm(centre[0]), mm(centre[1]), mm(centre[2])))
    obj = bpy.context.active_object
    obj.name = nom
    if axe == "Y":
        obj.rotation_euler[0] = math.radians(90)
    return obj


def appliquer(obj: bpy.types.Object, mat: bpy.types.Material) -> None:
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def appliquer_modificateurs(obj: bpy.types.Object) -> None:
    """
    Fige la pile de modificateurs dans le maillage, SANS passer par un
    opérateur.

    `bpy.ops.object.modifier_apply` dépend du contexte — objet actif ET
    sélectionné, mode objet, fenêtre valide. En exécution `--background`, il
    échoue régulièrement sans lever d'exception : le modificateur reste dans
    la pile, la géométrie n'est jamais modifiée, et rien ne le signale. C'est
    ce qui a fait disparaître la grille de mesure deux fois de suite.

    L'évaluation par le depsgraph n'a aucune de ces dépendances : elle lit le
    résultat calculé et le recopie dans un maillage neuf. C'est la voie fiable
    pour un script sans interface.
    """
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evalue = obj.evaluated_get(depsgraph)
    maillage = bpy.data.meshes.new_from_object(evalue)

    ancien = obj.data
    obj.data = maillage
    obj.modifiers.clear()
    if ancien.users == 0:
        bpy.data.meshes.remove(ancien)


def booleen_difference(cible: bpy.types.Object,
                       outils: list[bpy.types.Object]) -> None:
    """Creuse `cible` avec `outils`, puis supprime les outils."""
    for outil in outils:
        modif = cible.modifiers.new(name="creuse", type="BOOLEAN")
        modif.operation = "DIFFERENCE"
        modif.object = outil
        modif.solver = "EXACT"

    appliquer_modificateurs(cible)

    for outil in outils:
        bpy.data.objects.remove(outil, do_unlink=True)


def conges(obj: bpy.types.Object, rayon: float, segments: int = 4) -> None:
    modif = obj.modifiers.new(name="conges", type="BEVEL")
    modif.width = mm(rayon)
    modif.segments = segments
    modif.limit_method = "ANGLE"
    modif.angle_limit = math.radians(45)
    appliquer_modificateurs(obj)


def lisser(obj: bpy.types.Object, angle: float = 35.0) -> None:
    """
    Ombrage lisse au-delà d'un angle : les congés s'arrondissent, les faces
    planes gardent leur arête nette. C'est ce qui sépare un boîtier injecté
    d'une forme molle.

    IMPLÉMENTATION. `mesh.use_auto_smooth` a disparu en Blender 4.1, et son
    remplaçant `shade_auto_smooth` s'appuie sur un asset Geometry Nodes qui
    n'est pas résolu en exécution `--background` : l'opérateur écrit une
    erreur dans la console SANS lever d'exception Python, et laisse le modèle
    entièrement lissé. Un `try/except` ne rattrape donc rien.

    On marque plutôt les arêtes vives à la main et on les sépare avec un
    EdgeSplit. Le résultat est identique à l'auto-smooth, et il ne dépend
    d'aucune API de version ni d'aucun fichier d'assets.
    """
    maillage = obj.data
    seuil = math.radians(angle)

    for polygone in maillage.polygons:
        polygone.use_smooth = True

    maillage.calc_loop_triangles()
    for arete in maillage.edges:
        arete.use_edge_sharp = False

    # Angle dièdre : deux faces qui se rencontrent au-delà du seuil forment
    # une arête vive.
    faces_par_arete: dict[int, list[int]] = {}
    for polygone in maillage.polygons:
        for cle in polygone.edge_keys:
            index = maillage.edges.find(cle[0]) if False else None
        for arete_index in polygone.edge_keys:
            faces_par_arete.setdefault(arete_index, []).append(polygone.index)

    normales = {p.index: p.normal.copy() for p in maillage.polygons}
    for arete in maillage.edges:
        cle = (arete.vertices[0], arete.vertices[1])
        voisines = faces_par_arete.get(cle) or faces_par_arete.get(cle[::-1])
        if not voisines or len(voisines) != 2:
            continue
        a, b = normales[voisines[0]], normales[voisines[1]]
        if a.angle(b) > seuil:
            arete.use_edge_sharp = True

    modif = obj.modifiers.new(name="arêtes_vives", type="EDGE_SPLIT")
    modif.use_edge_angle = True
    modif.split_angle = seuil
    modif.use_edge_sharp = True
    appliquer_modificateurs(obj)


# ─────────────────────────────────────────────────────────────────────────────
# Pièces
# ─────────────────────────────────────────────────────────────────────────────

def construire_coque_superieure(mats) -> bpy.types.Object:
    """
    Coque avant : le volume que voit l'utilisateur. Elle porte la grille de
    mesure et le perçage de la fenêtre optique.
    """
    hauteur_coque = BOITIER_P - JOINT_Y
    centre_y = -(BOITIER_P / 2) + (hauteur_coque / 2)

    coque = bloc("sensor_outer_top_shell", BOITIER_L, BOITIER_H, hauteur_coque,
                 centre=(0, centre_y, 0))
    conges(coque, CONGE)

    outils = []

    # Fentes de la grille. Elles traversent la face avant sur 60 % de
    # l'épaisseur de coque : assez pour se lire en lumière rasante, pas assez
    # pour ouvrir le boîtier.
    depart_z = GRILLE_CZ + ((GRILLE_N - 1) * GRILLE_PAS) / 2
    for i in range(GRILLE_N):
        z = depart_z - i * GRILLE_PAS
        # La fente déborde franchement de part et d'autre de la face avant :
        # un outil booléen qui affleure exactement la surface produit des
        # faces coplanaires, que le solveur EXACT traite mal.
        fente = bloc(f"_fente_{i}", GRILLE_L, GRILLE_FENTE_H, EPAISSEUR * 2.4,
                     centre=(GRILLE_CX, -(BOITIER_P / 2) + EPAISSEUR * 0.5, z))
        outils.append(fente)

    # Perçage de la fenêtre optique, traversant.
    percage = cylindre("_percage_optique", OPTIQUE_D, EPAISSEUR * 4,
                       (OPTIQUE_X, -(BOITIER_P / 2) + EPAISSEUR, OPTIQUE_Z))
    outils.append(percage)

    booleen_difference(coque, outils)
    lisser(coque)
    appliquer(coque, mats["coque"])
    return coque


def construire_cavite_grille(mats) -> bpy.types.Object:
    """
    Plaque sombre posée juste derrière les fentes.

    C'est la pièce qui rend la grille visible. Une entaille de 1,6 mm dans un
    plastique à 96 % de blanc, éclairée par une lumière d'environnement
    diffuse, ne produit quasiment aucune ombre : les six fentes se lisaient
    comme des rayures. Avec un fond sombre derrière, chaque fente devient une
    ouverture — ce qu'elle est réellement, puisqu'il y a un volume creux
    derrière la face avant.
    """
    hauteur = (GRILLE_N - 1) * GRILLE_PAS + GRILLE_FENTE_H * 2
    cavite = bloc("sensor_outer_grille_cavity", GRILLE_L - 0.6, hauteur, 1.0,
                  centre=(GRILLE_CX, -(BOITIER_P / 2) + EPAISSEUR + 0.5, GRILLE_CZ))
    appliquer(cavite, mats["cavite"])
    return cavite


def construire_fenetre_optique(mats) -> bpy.types.Object:
    """Disque sombre affleurant, derrière lequel vit le VEML7700."""
    fenetre = cylindre(
        "sensor_outer_optical_window", OPTIQUE_D - 0.2, 1.2,
        (OPTIQUE_X, -(BOITIER_P / 2) + 0.9, OPTIQUE_Z))
    lisser(fenetre)
    appliquer(fenetre, mats["optique"])
    return fenetre


def construire_marquage(mats) -> list[bpy.types.Object]:
    """
    Marquage Ombrair : le signe en arche et trois lames, en relief de 0,15 mm.

    Le logotype n'est pas modélisé lettre à lettre — il serait illisible à
    cette taille et alourdirait le maillage. Le signe suffit à identifier la
    marque, et c'est lui que la planche met en avant.
    """
    pieces = []
    relief = 0.18
    face = -(BOITIER_P / 2)

    # Le signe SORT de la coque : son centre est décalé vers -Y de la moitié
    # de son relief. En V1 il était centré à +0,08 mm, donc entièrement noyé
    # DANS la coque — invisible au rendu, et le défaut ne se voyait qu'en
    # relevant les boîtes englobantes.
    y_signe = face - relief / 2
    largeur_signe = MARQUE_H * 0.82

    corps = bloc("sensor_outer_marking", largeur_signe, MARQUE_H, relief,
                 centre=(MARQUE_X, y_signe, MARQUE_Z))
    # Congé limité au tiers du relief : un rayon supérieur à l'épaisseur
    # transforme la plaquette en galet et fait exploser le maillage.
    conges(corps, relief * 0.3, segments=2)
    appliquer(corps, mats["marque"])
    pieces.append(corps)

    # Les trois lames, la troisième plus courte — comme le signe officiel.
    # Elles sont posées DEVANT le corps, sinon elles disparaissent dedans.
    for i, (dz, largeur) in enumerate(
            [(0.28, 0.60), (0.04, 0.60), (-0.20, 0.42)]):
        lame = bloc(
            f"sensor_outer_marking_slat_{i}",
            largeur_signe * largeur, MARQUE_H * 0.10, relief * 0.5,
            centre=(MARQUE_X, y_signe - relief * 0.6,
                    MARQUE_Z + MARQUE_H * dz))
        appliquer(lame, mats["coque"])
        pieces.append(lame)

    return pieces


def construire_coque_inferieure(mats) -> bpy.types.Object:
    """Coque arrière, avec la découpe du connecteur sur le flanc droit."""
    centre_y = (BOITIER_P / 2) - (JOINT_Y / 2)
    coque = bloc("sensor_outer_bottom_shell", BOITIER_L, BOITIER_H, JOINT_Y,
                 centre=(0, centre_y, 0))
    conges(coque, CONGE)

    # Découpe USB-C, flanc droit, sur la ligne de joint.
    decoupe = bloc("_decoupe_usb", EPAISSEUR * 3, 3.4, 9.2,
                   centre=(BOITIER_L / 2 - EPAISSEUR, centre_y, -BOITIER_H / 2 + 12))
    booleen_difference(coque, [decoupe])
    lisser(coque)
    appliquer(coque, mats["coque_dos"])
    return coque


def construire_jonc(mats) -> bpy.types.Object:
    """
    Jonc de séparation entre les deux coques.

    Les deux demi-boîtiers sont en Chaux : sans repère, ils se lisent comme un
    bloc plein et le produit perd sa crédibilité d'objet assemblé. Un anneau
    fin et légèrement plus sombre, posé sur la ligne de joint, suffit à dire
    « ça s'ouvre » — c'est le filet que montre la planche de charte.
    """
    y_joint = -(BOITIER_P / 2) + (BOITIER_P - JOINT_Y)
    jonc = bloc("sensor_outer_seam", BOITIER_L + 0.3, BOITIER_H + 0.3, 0.7,
                centre=(0, y_joint, 0))
    conges(jonc, CONGE, segments=3)
    lisser(jonc)
    appliquer(jonc, mats["jonc"])
    return jonc


def construire_platine(mats) -> bpy.types.Object:
    """
    Platine de fixation murale : plaque percée de deux trous oblongs, posée
    derrière la coque inférieure.
    """
    platine = bloc("sensor_outer_mount_plate", PLATINE_L, PLATINE_H, PLATINE_P,
                   centre=(0, BOITIER_P / 2 + PLATINE_P / 2, 0))
    conges(platine, 2.0)

    trous = []
    for x in (-PLATINE_L / 2 + 10, PLATINE_L / 2 - 10):
        trous.append(cylindre(
            f"_trou_{x:.0f}", 4.5, PLATINE_P * 3,
            (x, BOITIER_P / 2 + PLATINE_P / 2, 0)))
    booleen_difference(platine, trous)
    lisser(platine)
    appliquer(platine, mats["platine"])
    return platine


def construire_electronique(mats) -> list[bpy.types.Object]:
    """
    Implantation interne. Les volumes sont justes en taille et en position ;
    ils ne prétendent pas être routés.

    Le SHT45 est derrière la grille et le VEML7700 derrière la fenêtre
    optique : c'est la seule disposition cohérente avec la face avant.
    """
    pieces = []
    y_carte = 1.0

    carte = bloc("sensor_outer_pcb", BOITIER_L - 10, BOITIER_H - 10, 1.6,
                 centre=(0, y_carte, 0))
    appliquer(carte, mats["pcb"])
    pieces.append(carte)

    # ESP32-C3 : module blindé, au centre gauche.
    esp = bloc("sensor_outer_esp32", 18.0, 13.0, 3.0,
               centre=(-8, y_carte - 2.3, -6))
    appliquer(esp, mats["blindage"])
    pieces.append(esp)

    # SHT45 : petit boîtier, aligné sur le centre de la grille.
    sht = bloc("sensor_outer_sht45", 4.2, 4.2, 2.0,
               centre=(GRILLE_CX, y_carte - 1.8, GRILLE_CZ))
    appliquer(sht, mats["composant"])
    pieces.append(sht)

    # VEML7700 : aligné sur la fenêtre optique.
    veml = bloc("sensor_outer_veml7700", 4.4, 3.4, 1.9,
                centre=(OPTIQUE_X, y_carte - 1.75, OPTIQUE_Z))
    appliquer(veml, mats["composant"])
    pieces.append(veml)

    # Étage d'alimentation, côté connecteur.
    power = bloc("sensor_outer_power", 16.0, 10.0, 2.4,
                 centre=(20, y_carte - 2.0, -14))
    appliquer(power, mats["composant"])
    pieces.append(power)

    # Connecteur USB-C, débouchant sur le flanc droit.
    usb = bloc("sensor_outer_usb", 9.0, 3.2, 7.4,
               centre=(BOITIER_L / 2 - 8, y_carte - 1.0, -BOITIER_H / 2 + 12))
    conges(usb, 0.8, segments=2)
    appliquer(usb, mats["blindage"])
    pieces.append(usb)

    return pieces


# ─────────────────────────────────────────────────────────────────────────────
# Assemblage
# ─────────────────────────────────────────────────────────────────────────────

def construire(eclate: bool = False) -> dict:
    purger_scene()

    #
    # DIFFÉRENCIATION DES SURFACES.
    #
    # En V3, coque haute, coque basse et platine partageaient la même Chaux
    # (#f4f1e9, soit 96 % de blanc). Sous l'éclairage neutre du navigateur,
    # l'objet entier tenait dans les 6 % supérieurs de l'échelle de
    # luminance : plus aucun détail ne se lisait. Le réglage d'exposition
    # appliqué côté Blender ne corrigeait que les RENDUS — il ne part pas
    # dans le `.glb`.
    #
    # Les pièces reçoivent donc des valeurs distinctes, comme sur un vrai
    # produit injecté : la face vue reste Chaux, le dos descend d'un ton, la
    # platine technique est franchement plus grise.
    mats = {
        "coque": materiau("Ombrair_Chaux", CHAUX, 0.62),
        "coque_dos": materiau("Ombrair_Chaux_Dos", (0.855, 0.845, 0.815, 1.0), 0.68),
        "marque": materiau("Ombrair_Persienne", PERSIENNE, 0.5),
        "optique": materiau("Ombrair_Optique", NUIT, 0.12),
        # Cavité derrière la grille : c'est elle qui fait exister les fentes.
        # Sans fond sombre, six entailles de 1,6 mm dans un plastique quasi
        # blanc ne projettent rien et se lisent comme des cheveux.
        "cavite": materiau("Ombrair_Cavite", (0.10, 0.11, 0.12, 1.0), 0.9),
        "platine": materiau("Ombrair_Platine", (0.62, 0.62, 0.60, 1.0), 0.8),
        "pcb": materiau("Ombrair_PCB", (0.16, 0.28, 0.20, 1.0), 0.6),
        "blindage": materiau("Ombrair_Blindage", (0.72, 0.73, 0.74, 1.0), 0.35, metal=0.9),
        "composant": materiau("Ombrair_Composant", (0.30, 0.31, 0.32, 1.0), 0.5),
        # Chaux nettement assombrie : un joint se voit, il ne se crie pas.
        "jonc": materiau("Ombrair_Jonc", (0.48, 0.48, 0.46, 1.0), 0.7),
    }

    groupes = {
        "top": [construire_coque_superieure(mats)],
        "cavity": [construire_cavite_grille(mats)],
        "window": [construire_fenetre_optique(mats)],
        "marking": construire_marquage(mats),
        "electronics": construire_electronique(mats),
        "seam": [construire_jonc(mats)],
        "bottom": [construire_coque_inferieure(mats)],
        "plate": [construire_platine(mats)],
    }

    if eclate:
        # Écartement le long de Y : chaque strate s'éloigne de la face avant,
        # ce qui donne une lecture d'assemblage plutôt qu'une explosion.
        #
        # La fenêtre optique et le marquage restent COLLÉS à la coque qu'ils
        # habillent — écartés davantage, ils se lisaient comme des pièces
        # flottantes sans rattachement. Ils avancent juste assez pour qu'on
        # voie qu'ils sont rapportés.
        ecarts = {
            # La cavité garde l'écart de la coque avant : c'est sa paroi
            # intérieure, pas une pièce séparée. Détachée, les fentes
            # laissaient voir le fond de la scène et la grille redevenait
            # blanche — exactement le défaut qu'elle sert à corriger.
            "top": -58.0, "cavity": -58.0, "window": -66.0, "marking": -63.0,
            "seam": -26.0, "electronics": 0.0, "bottom": 42.0, "plate": 82.0,
        }
        for nom, objets in groupes.items():
            for obj in objets:
                obj.location.y += mm(ecarts[nom])

    return groupes


def exporter_glb(chemin: str) -> None:
    os.makedirs(os.path.dirname(chemin), exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.export_scene.gltf(
        filepath=chemin,
        export_format="GLB",
        export_apply=True,
        export_yup=True,
        use_selection=False,
        export_draco_mesh_compression_enable=False,
    )
    print(f"[ombrair] GLB écrit : {chemin} ({os.path.getsize(chemin) / 1024:.0f} ko)")


def main() -> None:
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    racine = args[0] if args else os.getcwd()

    # Modèle assemblé
    construire(eclate=False)
    blend = os.path.join(racine, "docs/3d/capteur-exterieur-ombrair.blend")
    os.makedirs(os.path.dirname(blend), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend)
    exporter_glb(os.path.join(racine, "public/models/capteur-exterieur-ombrair.glb"))

    # Modèle éclaté — second fichier plutôt qu'une animation : deux GLB
    # statiques sont plus robustes à charger et plus simples à remplacer.
    construire(eclate=True)
    exporter_glb(os.path.join(racine, "public/models/capteur-exterieur-ombrair-eclate.glb"))
    print("[ombrair] terminé")


if __name__ == "__main__":
    main()
