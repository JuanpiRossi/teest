import requests

def post(url,data):
    try:
        response = requests.post(url,json=data)
        res = response.json()
        return res
    except Exception, ex:
        print response.text
        print ex
        return False


def get(url):
    try:
        response = requests.get(url)
        res = response.json()
        return res
    except Exception, ex:
        print response.text
        print ex
        return False


def getBosses():
    zoneResponse = get("https://www.warcraftlogs.com/v1/zones?api_key=16653d65bcc270d94cf72848be6a1cdc")
    for zone in zoneResponse:
        if zone["id"] == 17:
            return zone["encounters"]
    return False


def getSpecs(clase):
    specs = {
    "Death Knight":["Melee","Frost","Unholy","Blood"],
    "Demon Hunter":["Havoc","Vengeance"],
    "Druid":["Balance","Restoration","Feral","Guardian"],
    "Hunter":["Ranged","Marksmanship","BeastMastery","Survival"],
    "Mage":["Ranged","Frost","Fire","Arcane"],
    "Monk":["Brewmaster","Mistweaver","Windwalker"],
    "Paladin":["Retribution","Holy","Protection"],
    "Priest":["Holy","Shadow","Discipline","Healing"],
    "Rogue":["Melee","Assassination","Outlaw","Subtlety"],
    "Shaman":["Elemental","Restoration","Enhancement"],
    "Warlock":["Ranged","Destruction","Affliction","Demonology"],
    "Warrior":["Melee","Arms","Fury","Protection"]}
    return specs[clase]


def getParses(player,specs,bosses):
    print "Getting parses"
    playerResponse = get("https://www.warcraftlogs.com/v1/parses/character/"+player["name"]+"/"+player["server"]+"/us?metric=dps&api_key=16653d65bcc270d94cf72848be6a1cdc")
    parse = {}
    difficultys = {"5":"mythic","4":"heroic","3":"normal"}
    for spec in specs:
        parse[spec] = {"overall":{"mythic":0,"heroic":0,"normal":0}}
        for boss in bosses:
            parse[spec][boss["name"]] = {"mythic":0,"heroic":0,"normal":0}
    for fullReport in playerResponse:
        for specReport in fullReport["specs"]:
            if fullReport["difficulty"] < 3:
                break
            difficulty = difficultys[str(fullReport["difficulty"])]
            parse[specReport["spec"]][fullReport["name"]][difficulty] = int(specReport["best_historical_percent"])
    counts = {}
    for spec in specs:
        counts[spec] = {"mythic":0,"heroic":0,"normal":0}
        for boss in bosses:
            for dif in ["mythic","heroic","normal"]:
                parse[spec]["overall"][dif] = parse[spec]["overall"][dif] + parse[spec][boss["name"]][dif]
                if parse[spec][boss["name"]][dif]!=0:
                    counts[spec][dif] = counts[spec][dif]+1
    for spec in specs:
        for dif in ["mythic","heroic","normal"]:
            if parse[spec]["overall"][dif] != 0:
                parse[spec]["overall"][dif] = int(parse[spec]["overall"][dif]/counts[spec][dif])
    print "Parses OK!"
    return parse


def getParsesIlvl(player,specs,bosses):
    print "Getting parses Ilvl"
    playerResponse = get("https://www.warcraftlogs.com/v1/parses/character/"+player["name"]+"/"+player["server"]+"/us?metric=dps&bracket=-1&api_key=16653d65bcc270d94cf72848be6a1cdc")
    parse = {}
    difficultys = {"5":"mythic","4":"heroic","3":"normal"}
    for spec in specs:
        parse[spec] = {"overall":{"mythic":0,"heroic":0,"normal":0}}
        for boss in bosses:
            parse[spec][boss["name"]] = {"mythic":0,"heroic":0,"normal":0}
    for fullReport in playerResponse:
        for specReport in fullReport["specs"]:
            if fullReport["difficulty"] < 3:
                break
            difficulty = difficultys[str(fullReport["difficulty"])]
            parse[specReport["spec"]][fullReport["name"]][difficulty] = int(specReport["best_historical_percent"])
    counts = {}
    for spec in specs:
        counts[spec] = {"mythic":0,"heroic":0,"normal":0}
        for boss in bosses:
            for dif in ["mythic","heroic","normal"]:
                parse[spec]["overall"][dif] = parse[spec]["overall"][dif] + parse[spec][boss["name"]][dif]
                if parse[spec][boss["name"]][dif]!=0:
                    counts[spec][dif] = counts[spec][dif]+1
    for spec in specs:
        for dif in ["mythic","heroic","normal"]:
            if parse[spec]["overall"][dif] != 0:
                parse[spec]["overall"][dif] = int(parse[spec]["overall"][dif]/counts[spec][dif])
    print "Parses Ilvl OK!"
    return parse

##########################################################################################################################################################################################################
##########################################################################################################################################################################################################
##########################################################################################################################################################################################################

print "Beging of process"
bosses = getBosses()
guildRoster = post("http://localhost:3000/api/getGuild",{"guildName": "Untamed"})['data']['Roster']
try:
    secuence = get("http://localhost:3000/api/getPlayerSorted")["data"]["secuence"]
except:
    secuence = 0

for index,player in enumerate(guildRoster):
    print "Player: " + str(index+1) + " of " + str(len(guildRoster)) + " - " + player['name']
    toSaveData = {"name":player['name'],"server":player['server'],"class":player['class'],"secuence":secuence+1}
    specs = getSpecs(player['class'])
    toSaveData["parse"] = getParses(player,specs,bosses)
    toSaveData["parseIlvl"] = getParsesIlvl(player,specs,bosses)
    print "Adding player"
    response  = post("http://localhost:3000/api/addPlayer",toSaveData)

print "Deleting old data"
response  = post("http://localhost:3000/api/removePlayer/f48y3g48fcg24f823ybfc8792f2b842",{"secuence":{"$lte":secuence}})
print "End of process"