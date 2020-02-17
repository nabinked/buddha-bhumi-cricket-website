const graymatter = require("gray-matter");
const handlebars = require("handlebars");
const fsextra = require("fs-extra");
const path = require("path");
const siteData = require('./site-data')


function enrichFrontMatter(rawFrontMatter, dataDir) {
    return { ...rawFrontMatter, ...buildMetaData(), data: siteData(dataDir) };
}

function getDataFromFile(dataValue) {
    const file = dataValue.replace('file::', '');
    console.log(file)


}

function buildMetaData() {
    return {
        buildTs: Date.now()
    }
}
function loadLayoutTemplate(layoutsDir, layoutName) {
    const layoutFilePath = path.join(layoutsDir, layoutName + '.html');
    const layoutContent = fsextra.readFileSync(layoutFilePath, { encoding: 'utf-8' });
    return handlebars.compile(layoutContent);

}

module.exports = (filePath, layoutsDir, dataDir) => {
    console.log('Rendering page: ' + filePath)
    const fileRawContent = fsextra.readFileSync(filePath);
    const { content, data, } = graymatter(fileRawContent);
    const model = enrichFrontMatter(data, dataDir);
    console.log('model', JSON.stringify(model, null, 2))
    const fileRender = handlebars.compile(content)(model);
    let finalRender = fileRender;
    if (model.layout) {
        const template = loadLayoutTemplate(layoutsDir, model.layout);
        finalRender = template({ ...model, main: finalRender });
    }
    console.log('rendered')
    return finalRender;
}