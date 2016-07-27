from urllib2 import *
import urllib
import collections
import itertools
from gluon.serializers import json
import math


def index():
    session.keyword = str(request.vars.inputkeyword)
    if(session.keyword == "None"):
        session.keyword = "*"
    else:
        session.keyword = str(request.vars.inputkeyword)
    
    f = { 'q' : session.keyword}
    f2 = {'inputkeyword': session.keyword}
    if(request.vars.page):
        page = int(request.vars.page)
        
    else:
        page=1
    print page

    #part 2
    facetoffset = (int(page)-1)*20
    rows = facetoffset+20
    

    facetlimit=20
    connection1 = urlopen('http://localhost:8983/solr/webofscienceindex/select?'+urllib.urlencode(f)+'&rows=2000&wt=json&indent=true&facet=true&facet.field=authors&facet.field=published&facet.mincount=1&facet.limit='+str(facetlimit)+'&facet.offset='+str(facetoffset))
    response = eval(connection1.read())
    articles = response['response']['docs']
    facet = response['facet_counts']['facet_fields']
    
    authorArticles =[]
    totalArticles = []
    facetList =[]
    for f in facet['authors']:
        if(facet['authors'].index(f) %2 == 0):
            authorArticles.append(f)
        else:
            totalArticles.append(f)
    facetList.append(authorArticles)
    facetList.append(totalArticles)
    length = len(facetList[0])
    #end of part2
    mydict = {}
    for i in range(len(facetList[0])):
        cot = ("\"","\"")
        authorname = facetList[0][i].join(cot)
        f = { 'q' : session.keyword, 'fq' : "authors:"+authorname}
       # print session.keyword
       # print authorname
        connection2 = urlopen('http://localhost:8983/solr/webofscienceindex/select?'+urllib.urlencode(f)+'&start=0&rows=10&wt=json&indent=true&facet=true&facet.field=authors&facet.field=published&facet.mincount=1&facet.limit=100')
        response2 = eval(connection2.read())
        articles = response2['response']['docs']
        uniquekeywords = []
        for article in articles:
            keywords = []
            if 'keywords' in article :
                for keyword in article['keywords']:
                    keywords.append(keyword.lower())
            keywordsplus = []
            if 'keywordsplus' in article :
                for keywordplus in article['keywordsplus']:
                    keywordsplus.append(keywordplus.lower())
            totalkeywords = itertools.chain(keywords, keywordsplus)
            for keywords in totalkeywords:
                uniquekeywords.append(keywords)
            keywordcomplete = json(set(uniquekeywords))
        #authors and total keywords dictionary    
        if facetList[0][i] in mydict:
            mydict[facetList[0][i]] += keywordcomplete
        else:
            mydict[facetList[0][i]] = keywordcomplete
    
    mydict = collections.OrderedDict(sorted(mydict.items()))
    print mydict
        
    
    #Autocomplete#
    uniquekeywords = []
    for article in articles:
        keywords = []
        if 'keywords' in article :
            for keyword in article['keywords']:
                keywords.append(keyword.lower())
        keywordsplus = []
        if 'keywordsplus' in article :
            for keywordplus in article['keywordsplus']:
                keywordsplus.append(keywordplus.lower())
        totalkeywords = itertools.chain(keywords, keywordsplus)
        for keywords in totalkeywords:
            uniquekeywords.append(keywords)
        keywordcomplete = json(set(uniquekeywords))

    
    return dict(f2=f2,keyword =session.keyword, facetList=facetList, length = length,  articles=articles, keywordcomplete = json(set(uniquekeywords)), rows=rows , facetoffset=facetoffset, page=page, mydict=mydict)

def author():

    keyword2 = session.keyword
    
    authorrequest = str(request.vars.author)
    print(authorrequest)
    authorname = authorrequest.replace('__', ', ')
    athname = session.authorname
    cot = ("\"","\"")
    authorname = authorname.join(cot)

    f = { 'q' : keyword2, 'fq' : "authors:"+authorname}
    urlname = urllib.urlencode(f)
    connection = urlopen('http://localhost:8983/solr/webofscienceindex/select?'+urllib.urlencode(f)+'&rows=20000&wt=json&indent=true&facet=true&facet.field=authors&facet.field=published&facet.mincount=1&facet.limit=100')
    response = eval(connection.read())
    matches = response['response']['numFound']
    articles = response['response']['docs']
    facet = response['facet_counts']['facet_fields']
    #articles = sorted(articles, key=lambda k: k ['published'][0], reverse= True)
    articlesList = []
    puclisheddates = []
    for a in articles:
        article = {}
        #p = a['published'][0]
        #new['published'] = p
        #article['authors'] = a[0][0]
        article['title'] = a['title'][0]
        #article['abstract'] = a[2][0]
        #article['keywords'] = a['keywords'][0]
        #article['address'] = a['revisedAddress'][0]
        #dates.append(d)
        articlesList.append(article)
    #dates = list(set(dates)) # coklu degerleri uniqe yapar
    length = len(articlesList[0])

    years =[]
    numofpub = []
    facetListyears =[]
    facetList =[]
    for f in facet['published']:
        if(facet['published'].index(f) %2 == 0):
            years.append(f[-4:])
        else:
            numofpub.append(f)
    facetListyears.append(years)
    facetListyears.append(numofpub)
    #lengthofyears = len(facetList[0])
    mydict = {}
    for i in range(len(facetListyears[0])):
        if facetListyears[0][i] in mydict:
            mydict[facetListyears[0][i]] += facetListyears[1][i]
        else:
            mydict[facetListyears[0][i]] = facetListyears[1][i]
    
    mydict = collections.OrderedDict(sorted(mydict.items()))

    #Autocomplete#
    uniquekeywords = []
    for article in articles:
        keywords = []
        if 'keywords' in article :
            for keyword in article['keywords']:
                keywords.append(keyword.lower())
        keywordsplus = []
        if 'keywordsplus' in article :
            for keywordplus in article['keywordsplus']:
                keywordsplus.append(keywordplus.lower())
        totalkeywords = itertools.chain(keywords, keywordsplus)
        for keywords in totalkeywords:
            uniquekeywords.append(keywords)
        keywordcomplete = json(set(uniquekeywords))
    return dict(articlesList = articlesList, articles=articles, keyword =keyword2, matches=matches,urlname=urlname,authorname=authorname,length=length, athname=athname ,facetListyears=facetListyears, mydict=mydict, keywordcomplete = json(set(uniquekeywords)))
