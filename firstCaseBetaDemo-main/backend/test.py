import sys
import re

text_array = sys.argv
text_array.pop(0)

content = ''

for i in range(len(text_array)):
    if i !=len(text_array) -1:
        content = content + text_array[i] + " "
    else:
        content = content + text_array[i]

neglect_list = ["when", "what", "which", "should", "cases", "case", "study", "principle", "ratio", "regular", "qualified"]

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
print(string)

content = re.sub(string, "", content,flags=re.I )

print('\n\n\n')

print(content)