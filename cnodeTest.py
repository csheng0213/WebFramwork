#coding:utf-8
import time
import datetime
import urllib2
import pymongo
import re

#去除和替换字符串中的一些符号
class Tool:
    def replace(self,str):
        str = re.sub('\'|\"| ','',str)
        str = re.sub('<.*?>','',str)
        str = re.sub('&#x2F;','/',str)
        str = re.sub('&#x27;','\'',str)
        return str.strip()
#MongoDB连接
class Mongo:
    def createLink(self):
        try:
            client = pymongo.MongoClient(host='localhost', port=27017)
            db = client.blog
            # db.authenticate('sweet', 'mubai031224')#权限验证
            return db
        except :
            print pymongo.errors
            return None

#爬取并存储Cnode社区中我的帐号下帖子题目、内容
class CNode:
    def __init__(self):
        self.baseurl = 'http://cnodejs.org'
        self.url = 'http://cnodejs.org/user/a1511870876/topics'
        self.tool = Tool()
        self.db = Mongo()

    def getPage(self,url):
        try:
            request = urllib2.Request(url)
            response = urllib2.urlopen(request)
            code = response.read().decode('utf-8')
            return code
        except urllib2.URLError, e:
            if hasattr(e,'reason'):
                print u'连接CNode社区失败，错误原因',e.reason
                return None

    def getLinks(self):
        page = self.getPage(self.url)
        links = []
        items = re.findall('<a.*?class="topic_title.*?href=(.*?)title=(.*?)>',page,re.S)
        for item in items:
            links.append([self.baseurl+self.tool.replace(item[0]),self.tool.replace(item[1])])
        return links

    def getContent(self,page):
        items = re.search('<div.*?class="markdown-text.*?>(.*?)</div>',page,re.S)
        result = self.tool.replace(items.group(1))
        newtext = re.sub('\n','</br>',result)
        return newtext

    def getAbstract(self,text):
        abstract = re.search('.*?</br>(.{0,300})',text,re.S)
        return abstract.group(1)

    def start(self):
        starttime = datetime.datetime.now()
        print u"1、读取用户全部发帖链接和题目开始"+str(starttime)
        links = self.getLinks()
        endtime = datetime.datetime.now()
        print u"1、读取用户全部发帖链接和题目结束，耗时："+str((endtime - starttime).seconds) + 's'

        starttime = datetime.datetime.now()
        print u"2、根据得到的链接读取用户全部发帖内容并存储开始"+str(starttime)
        db = self.db.createLink()
        db.articles.remove()
        for link in links:
            page = self.getPage(link[0])
            text = self.getContent(page)
            abstract = self.getAbstract(text)
            title = re.sub('\+','',link[1])

            sysdate =  time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),'%Y-%m-%d %H:%M:%S')
            y, m, d ,h ,mi ,s= sysdate[0:6]
            stime= datetime.datetime(y, m, d ,h ,mi/5*5 ,0)
            sstr = stime.strftime('%Y-%m-%d')
            Obj = {"title":title,"abstract":abstract,"text":text,"time":sstr}
            db.articles.save(Obj)
        endtime = datetime.datetime.now()
        print u"2、根据得到的链接读取用户全部发帖内容并存储结束，耗时："+str((endtime - starttime).seconds) + 's'

if __name__ == "__main__":
    while True:
        spider = CNode()
        spider.start()
        del spider
        time.sleep(1*24*60*60)
