/*
    The articles route, responsible for handling most of the core funtionality of the 
    code challenge assignment.
*/

const express = require('express')
const MariaDBClient = require('../public/MariaDBClient')
const WebScraper = require('../public/WebScraper')

const router = express.Router()

/*
    endpoint: 
        currenturl:2022/articles (could be localhost)
    method:
        GET
    return: 
        successfully return list of articles:
            {
                "message": "success",
                "articles": [
                    { 
                        "id": string,
                        "type": string
                    }
                ]
            }
        error:
            {
                "message": "There was an issue..."
            }
*/

router.get('/', (req, res, next) => {
    //  get credentials from .env file in main directory for api
    //  or default value
    const port = process.env.SQLPORT || 2021
    const host = process.env.SQLHOST || 'maria'
    const user = process.env.SQLUSER || 'testuser'
    const pass = process.env.SQLPASSWORD || 'password'
    const db = process.env.SQLDATABASE || 'objectdb'

    //  make connection to MariaDB and return all article links
    const maria = new MariaDBClient(host, port, user, pass, db)
    const getAllArticles = 'select * from externalarticle'
    maria.query(getAllArticles)
        .then(list => {
            maria.close()
                .then(() => {
                    console.log('Returning the entire list of articles now...')
                    res.status(200).json({'message': 'success', 'articles': list})
                })
        })
        .catch(err => {
            console.log(err)
            res.status(404).send({'message': `There was an issue retrieving the list of articles on worker id: ${process.pid}.`})
        })
})

/*
    endpoint: 
        currenturl:2022/articles/:type/:id (could be localhost)
        type can be pubmed, omim, or hgmd
    method:
        GET
    return: 
        successfully return abstract:
            {
                "message": "success",
                "articlesid": string
                "abstract": string
            }
        error:
            {
                "message": "Error retrieving abstract.."
            }
*/

router.get('/:type/:id', (req, res, next) => {
    //  Endpoint with id for article
    let endpoint = ''
    let element = ''
    
    //  check article type for appropriate endpoint
    switch(req.params.type) {
        case 'pubmed':
            endpoint = `https://pubmed.ncbi.nlm.nih.gov/${req.params.id}`
            element = '#enc-abstract p'
            break
        case 'omim':
            console.log('omim functionality not ready yet.')
            break
        case 'hgmd':
            console.log('hgmd functionality not ready yet.')
            break
        default:
            console.log('Incorrect type.')
            res.status(404).send({'message': 'Incorrect article type specified.'})
    }

    console.log(`Endpoint for article is ${endpoint}.`)

    //  Utilize the WebScraper class to get the page data
    const webscraper = new WebScraper(endpoint)
    webscraper.parse(element)
        .then(abstract => {
            if(abstract == '' || abstract.length == 0) {
                console.log(`Error finding abstract for ${req.params.type} article id ${req.params.id}.`)
                res.status(202).json({'message': `Error finding abstract for ${req.params.type} article id ${req.params.id}.`, 'articleid': req.params.id, 'abstract': 'There is no Abstract for this Article.'})
            }
            else {
                console.log(`Abstract for ${req.params.type} article id ${req.params.id}:\n${abstract}\n`)
                res.status(200).json({'message': 'success', 'articleid': req.params.id, 'abstract': abstract})
            }
        })
        .catch(err => {
            console.log(err)
            res.status(404).send({'message': `Error retrieving abstract for article id ${req.params.id} on worker id ${process.pid}`})
        })

})

module.exports = router