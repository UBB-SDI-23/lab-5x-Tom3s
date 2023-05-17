import random

pass_hash = "8a002c2624e9aa164d5a8229d00c13da2b2056dcb62ccbc576bde4742f5f7dad"

adjectives = [
    "abandoned",
    "absolute",
    "adventurous",
    #B
    "babyish",
    "bad",
    "back",
    #C
    "cagey",
    "calculating",
    "callous",
    #D
    "damaged",
    "damp",
    "dangerous",
    #E
    "eager",
    "early",
    "earnest",
    #F
    "fabulous",
    "faded",
    "faint",
    #G
    "gabby",
    "gainful",
    "gamy",
    #H
    "habitual",
    "half",
    "hallowed",
    #I
    "icky",
    "icy",
    "ideal",
    #J
    "jaded",
    "jagged",
    "jazzy",
    #K
    "kaput",
    "keen",
    "kind",
    #L
    "labored",
    "lackadaisical",
    "lacking",
    #M
    "macabre",
    "macho",
    "maddening",
    #N
    "naive",
    "nappy",
    "narrow",
    #O
    "oafish",
    "obedient",
    "obeisant",
    #P
    "pale",
    "paltry",
    "panicky",
    #Q
    "quack",
    "quaint",
    "qualified",
    #R
    "rabid",
    "racial",
    "radical",
    #S
    "sad",
    "safe",
    "salty",
    #T
    "taboo",
    "tacit",
    "tacky",
    #U
    "ubiquitous",
    "ugliest",
    "ugly",
    #V
    "vacuous",
    "vagabond",
    "vague",
    #W
    "wacky",
    "waggish",
    "waiting",
    #X
    "xenophobic",
    "xeric",
    "xerotic",
    #Y
    "yummy",
    "youthful",
    "yucky",
    #Z
    "zany",
    "zealous",
    "zesty"
]

nouns = [
    "abnormality",
    "abode",
    "abolishment",
    #B
    "baby",
    "back",
    "backbone",
    #C
    "cabbage",
    "cabin",
    "cabinet",
    #D
    "dad",
    "daffodil",
    "dagger",
    #E
    "eagle",
    "ear",
    "earth",
    #F
    "fabric",
    "face",
    "fact",
    #G
    "gadget",
    "gaffe",
    "gain",
    #H
    "habit",
    "hacienda",
    "hacksaw",
    #I
    "ice",
    "icicle",
    "idea",
    #J
    "jackal",
    "jacket",
    "jaguar",
    #K
    "kale",
    "kamikaze",
    "kangaroo",
    #L
    "laborer",
    "lace",
    "lack",
    #M
    "macaroni",
    "machine",
    "macrame",
    #N
    "nail",
    "name",
    "naming",
    #O
    "oak",
    "oar",
    "oasis",
    #P
    "pail",
    "pain",
    "paint",
    #Q
    "quack",
    "quadrant",
    "quail",
    #R
    "rabbit",
    "raccoon",
]

def generate_username():
    return f"{random.choice(adjectives)}_{random.choice(nouns)}{random.randint(0, 1000) if random.randint(0, 1) == 1 else ''}"


with open('filler.session.sql', 'w') as f:
    f.write("INSERT INTO users (username, passwordhash) VALUES\n")
    for i in range(10000):
        f.write(f"('{generate_username()}', '{pass_hash}'){';' if i == 9999 else ','}\n")