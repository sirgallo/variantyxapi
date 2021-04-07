const fetch = require('node-fetch')
const jsdom = require('jsdom')
const e = require('express')
const { JSDOM } = jsdom

class WebScraper {
    //  constructor for class with endpoint attribute
    //  endpoint eg. -> https://pubmed.ncbi.nlm.nih.gov/20021716
    constructor(endpoint) {
        this.endpoint = endpoint
    }

    //  parse the abstract from the html returned from fetching the page
    async parse(element) {
        const reshtml = await this.getPage()
        const dom = new JSDOM(reshtml)

        /*
            element structure:
                <div id=enc-abstract>
                    <p>
                        ...Abstract text
                    </p>
                </div>

            get back just the text within the <p> element in #enc-abstract element on page
        */
       
        if(dom.window.document.body.querySelector(element)) {
            const htmlabs = dom.window.document.querySelector(element).textContent
            
            //  trim out unnecessary lines
            const abstract = htmlabs.split('\n').join('').split('    ').join('')
            if(abstract.length == 0) 
                return ''
            else
                return abstract
        }
        else
            return ''
    }

    //  get the page data utilizing fetch method
    //  method -> GET
    async getPage() {
        const res = await fetch(this.endpoint)
        return res.text()
    }
}

module.exports = WebScraper