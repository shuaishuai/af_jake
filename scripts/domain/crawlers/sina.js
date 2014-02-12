// TODO: asimov
// class SinaDupont:
//     def __init__(self, roe, roa, dar, ros, tat, profit, revenue, asset):
//         self.roe = float(roe.strip("%")) / 100.0
//         self.roa = float(roa.strip("%")) / 100.0
//         self.dar = float(dar.split("-")[1].replace(")", ""))
//         self.ros = float(ros.strip("%")) / 100.0
//         self.tat = float(tat.strip("%")) / 100.0 # total asset turnover
//         self.profit = int(profit.replace(",", ""))
//         self.revenue = int(revenue.replace(",", ""))
//         self.asset = int(asset.replace(",", ""))
//         if self.ros == 0:
//             self.ros = 1.0 * self.profit / self.revenue
//         if self.tat == 0:
//             self.tat = 1.0 * self.revenue / self.asset

//     def __repr__(self):
//         return """
// roe: %s
// roa: %s
// dar: %s
// ros: %s
// tat: %s
// profit: %s
// revenue: %s
// asset: %s
// """ % (self.roe, self.roa, self.dar, self.ros, self.tat, self.profit,
//             self.revenue, self.asset)


// class Sina:
//     def __init__(self):
//         pass

//     def getDupont(self):

//         code = 601288
//         url = "http://vip.stock.finance.sina.com.cn/corp/go.php/vFD_DupontAnalysis/stockid/%s/displaytype/10.phtml" % code
//         h = requests.get(url)
//         h.encoding = 'gb2312'
//         h = h.text

//         # print h
//         soup = BeautifulSoup(h)
//         content = soup.find("div", {"id": "con02-1"})
//         content = content.findAll("div")[1]
//         content = content.find("table")
//         # print content

//         tables = content.findAll("table")
//         data = []
//         for t in tables:
//             if not t.find("table"):
//                 data.append(t)

//         d = SinaDupont(
//                 roe=data[0].findAll("td")[1].text,
//                 roa=data[3].findAll("td")[1].text,
//                 dar=data[4].findAll("td")[1].text,
//                 ros=data[8].findAll("td")[1].text,
//                 tat=data[9].findAll("td")[1].text,
//                 profit=data[13].findAll("td")[1].text,
//                 revenue=data[14].findAll("td")[1].text,
//                 asset=data[16].findAll("td")[1].text)
//         print d