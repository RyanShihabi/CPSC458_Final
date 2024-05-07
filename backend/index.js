const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

const getValIn = (text) => {
    if(text.includes("|")){
        const type = text.split(":")[0];
        const measurements = text.split(":")[1].split(" | ");
    
        const imperial = measurements[0];
    
        let feet = 0;
        let inches = 0;
        
        console.log(`${type}:`);
        if(imperial.includes("’") && imperial.includes('”')){
            feet = parseFloat(imperial.split("’")[0]);
            console.log(`${feet} ft`);
            inches = parseFloat(imperial.split("’")[1].split('”')[0]);
            console.log(`${inches} in`);
        } else if(imperial.includes("-") && imperial.includes('”')) {
            inches = parseFloat(imperial.split("-")[1].split('”')[0]);
            console.log(`${inches} in`);
        } else if(imperial.includes("-") && imperial.includes('’')){
            feet = parseFloat(imperial.split("-")[1].split('’')[0]);
            console.log(`${feet} ft`);
        } else if(imperial.includes('”')){
            inches = parseFloat(imperial.split('”')[0]);
            console.log(`${inches} in`);
        } else if(imperial.includes("’")) {
            feet = parseFloat(imperial.split("’")[0]);
            console.log(`${feet} ft`);
        }
        
        return feet * 12 + inches;
    }
    return 0;
};


app.get("/find/:query", async (req, res) => {
    let item_query = req.params.query;
    const url = `https://www.dimensions.com/search?query=${item_query}`;

    let height = 0;
    let width = 0;
    let length = 0;
    let name = "";
    
    try {
        const response = await axios.get(url);
        const html = response.data;
        let $ = cheerio.load(html);
    
        const items = $('a.search-item-img-button');
        
        for(let i = 0; i < items.length; ++i){
            height = 0;
            width = 0;
            length = 0;

            if(items[i].attribs.href.includes("collection")){
                continue;
            }

            name = items[i].attribs.href.split("/")[2];

            const element_url = `https://www.dimensions.com${items[i].attribs.href}`;

            console.log(element_url);
            
            const element_response = await axios.get(element_url);
            const element_html = element_response.data;
            let $ = cheerio.load(element_html);

            const element_details = $('div.detail-text-item-wrapper');

            for(let i = 0; i < element_details.length; ++i){
                let text = $(element_details[i]).text();
                if(text.includes("Height")) {
                    height = getValIn(text);
                } else if(text.includes("Width")) {
                    width = getValIn(text);
                } else if(text.includes("Length") || text.includes("Depth")) {
                    length = getValIn(text);
                }
            }

            console.log({name: name, width: width, height: height, length: length});
            
            if(height != 0 && width != 0 && length != 0){
                break;
            }
        }
    } catch (error){
        console.log(error);
        res.json({name: "", width: 0, height: 0, length: 0});
    }

    res.json({name: name, width: width, height: height, length: length});
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});