Apify = require('apify')
const { data } = require('jquery')
const fs = require('fs')
var jsdom = require('jsdom')
const { resolveCname } = require('dns')
var $ = require('jquery')(new jsdom.JSDOM().window)


(async () => {
      // Get the username and password inputs

    const browser = await Apify.launchPuppeteer()
    const page = await browser.newPage()
    await page.goto('https://www.amazon.com/ap/signin?openid.return_to=https%3A%2F%2Faffiliate-program.amazon.com%2F&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=amzn_associates_us&openid.mode=checkid_setup&marketPlaceId=ATVPDKIKX0DER&language=en_US&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=0')

    // Login
    await page.type('#ap_email', 'adibhurtadoolson@gmail.com')
    await page.type('#ap_password', 'adibisthebest4A')
    await page.click('#signInSubmit')
    await page.waitForNavigation()

    // Get cookies
    const cookies = await page.cookies();

    // Use cookies in another tab or browser
    const page2 = await browser.newPage();
    await page2.setCookie(...cookies);
    // Open promo page
    await page2.goto('https://affiliate-program.amazon.com/home/promohub/promocodes?ac-ms-src=nav&type=mpc&active_date_range=0')
    await page2.setViewport({
      width:1200,
      height: 800
    })
    console.log("Arrived to website")


    await autoScroll(page2)
    await dataGetter(page2)

})

async function autoScroll(page2) {
  console.log("Autoscrolling started")
  await page2.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0
      var distance = 250
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve()
        }
      }, 500)
    })
  })
  console.log("Done Scrolling")
}

async function dataGetter(page2){
  let categories = await page2.$$eval('.a-column.a-span12.promo-category', allCat => allCat.map(cat => cat.textContent))
  let links = await page2.$$eval('.a-link-normal', allLink => allLink.map(a => a.href))
  let descriptions = await page2.$$eval('.a-link-normal', allDesc => allDesc.map(desc => desc.textContent))
  descriptions = descriptions.slice(10)
  let new_cat = []
  let date = []
  var results = []
  for (var i = 0; i < categories.length; i++) {
    
    if(i % 2 === 0) { 
        new_cat.push(categories[i]);
    }
    else{
        date.push(categories[i])
    }
}
  for(var i = 1; i < new_cat.length; i++ ){
    temp = {
      "Category": new_cat[i],
      "Link": links[i],
      "Description": descriptions[i],
      "Date": date[i]
    }
    results.push(temp)
  }
  results = JSON.stringify(results)
  fs.writeFile('data2.json',  results, (err) =>{
    if (err) throw err

    console.log("Data saved!")
  })

  console.log(results)
}
