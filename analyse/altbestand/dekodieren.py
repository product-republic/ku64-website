import base64, json, sys
# Die base64-Nutzlast kommt aus dem Drive-Download.
roh = sys.stdin.read().strip()
open('htaccess.txt','wb').write(base64.b64decode(roh))
print('geschrieben')
