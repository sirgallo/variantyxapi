# Variantyx API
## Written in Node.JS using Express.JS Middleware

### Routes

endpoint: 
    currenturl:2022/articles (could be localhost)
method:
    GET
return (JSON): 
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

endpoint: 
    currenturl:2022/articles/:type/:id (could be localhost)
    type can be pubmed, omim, or hgmd
method:
    GET
return (JSON): 
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
