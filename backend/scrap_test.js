const axios = require("axios");
const cheerio = require("cheerio");

const url = `https://www.dimensions.com/search?query=plane`;

const getValIn = (text) => {
    console.log(text);
    if(text.includes("|")){
        const measurements = text.split(":")[1].split(" | ");
    
        const imperial = measurements[0];
    
        let feet = 0;
        let inches = 0;
        
        if(imperial.includes("’") && imperial.includes('"')){
            feet = parseFloat(imperial.split("’")[0]);
            inches = parseFloat(imperial.split("’")[1].split('”')[0]);
        } else if(imperial.includes("-") && imperial.includes('”')) {
            inches = parseFloat(imperial.split("-")[1].split('”')[0]);
        } else if(imperial.includes('”')){
            inches = parseFloat(imperial.split('”')[0]);
        } else if(imperial.includes("’")) {
            feet = parseFloat(imperial.split("’")[0]);
        }

        console.log(`${feet * 12 + inches} in`);
        
        return feet * 12 + inches;
    }
    
    return 0;

}

const test = async () => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        let $ = cheerio.load(html);
    
        const items = $('a.search-item-img-button');
        
        for(let i = 0; i < items.length; ++i){
            let height = 0;
            let width = 0;
            let length = 0;

            if(items[i].attribs.href.includes("collection")){
                continue;
            }

            const element_url = `https://www.dimensions.com${items[i].attribs.href}`;

            console.log(items[i].attribs.href.split("/")[2]);
            
            const element_response = await axios.get(element_url);
            const element_html = element_response.data;
            let $ = cheerio.load(element_html);

            const element_details = $('div.detail-text-item-wrapper');
            
            for(let i = 0; i < element_details.length; ++i){
                let text = $(element_details[i]).text();
                if(text.includes("Height")){
                    height = getValIn(text);
                } else if(text.includes("Width")) {
                    width = getValIn(text);
                } else if(text.includes("Length")) {
                    length = getValIn(text);
                }
            }
            
            console.log({width: width, height: height, length: length});

            if(height != 0 && width != 0 && length != 0){
                return {width: width, height: height, length: length};
            }
            break;
        }
    } catch (error){
        console.log(error);
    }
};

console.log(test());