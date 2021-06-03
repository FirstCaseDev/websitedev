import sys
import spacy
import json
import re

text_array = sys.argv
text_array.pop(0)

content = ''

for i in range(len(text_array)):
    if i !=len(text_array) -1:
        content = content + text_array[i] + " "
    else:
        content = content + text_array[i]

neglect_list = ["when", "what", "which", "should", "cases", "case", "study", "principle", "ratio", "regular", "qualified", "the"]

court_phrases = ["court", "delhi high court", "supreme court","supreme court of india"]

# Functions

def createRegexString(array):
    regex_string = "('"
    for i in range(len(array)):
        if i != len(array)-1:
            regex_string += f"({array[i]})|"
        else:
            regex_string += f"({array[i]})')"
    return regex_string

string = createRegexString(neglect_list)

content = re.sub(str(string), "",  content, re.IGNORECASE)

nlp = spacy.load("en_core_web_sm")

doc = nlp(content)

nouns_list = []; verbs_list= []; entities_text = []; entities_label = []

for chunk in doc.noun_chunks:
    nouns_list.append(chunk.text)

for token in doc:
    if token.pos_ == "VERB":
        verbs_list.append(token.lemma_)

for entity in doc.ents:
    entities_text.append(entity.text)
    entities_label.append(entity.label_)

processed_noun = []
for elem in nouns_list:
    if len(elem) > 2:
        regex_string = createRegexString(neglect_list)
        new_elem = re.sub(regex_string, "",  elem,flags=re.I )
        if ((new_elem != " ") and (new_elem != "")):
            processed_noun.append(new_elem)

result = {
    'nouns': nouns_list,
    'processed_nouns': processed_noun,
    'verbs': verbs_list,
    'entities': {
        "entities_text": entities_text, 
        "entities_label": entities_label
        },
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