import sys
import spacy
import json
import re

neglect_list = ["when", "what", "which", "should", "cases", "case", "study"]

nlp = spacy.load("en_core_web_sm")
array = sys.argv
array.pop(0)
text = ''
for elem in array:
    text = text + " " + elem

doc = nlp(text)

nouns_list = []; verbs_list= []; entities_list = []

for chunk in doc.noun_chunks:
    nouns_list.append(chunk.text)

for token in doc:
    if token.pos_ == "VERB":
        verbs_list.append(token.lemma_)

for entity in doc.ents:
    entities_list.append({entity.text, entity.label_})

token_list = []; all =[]

for sent in doc.sents:
    for token in sent:
        if elem != " ":
            all.append(token.text)

token_list = all.copy()

for elem in token_list:
    if str(elem).lower() in neglect_list:
        token_list.remove(elem)

processed_noun = []
for elem in nouns_list:
    if len(elem) > 2:
       processed_noun.append(re.sub(r'((what)|(when)|(which)|(should)|(cases)|(case)|(study))', "",  elem, flags=re.I ))

result = {
    'nouns': nouns_list,
    'processed_nouns': processed_noun,
    'verbs': verbs_list,
    'entities': entities_list,
    'all': all,
    'token_list': token_list,
}

print(json.dumps(result))

# for sent in doc.sents:
#     print([token.text for token in sent])

# # Analyze syntax
# print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
# print("verbs_list:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

# # Find named entities_list, phrases and concepts
# print("entities_list: ")
# for entity in doc.ents:
#     print(entity.text, entity.label_)