const graymatter = require("gray-matter");
const handlebars = require("handlebars");
const fsextra = require("fs-extra");


function buildMetaData() {
    return {
        buildTs: Date.now()
    }
}

function renderFile(filePath, ctx) {
    console.log('Rendering: ' + filePath);
    const fileRawContent = fsextra.readFileSync(filePath);
    return render(fileRawContent, ctx);
}

function render(raw, initCtx) {
    const { content, data } = graymatter(raw);
    const ctx = { ...initCtx, ...data };
    const html = handlebars.compile(content)(ctx);
    return { ctx, html }
}

function wrapInLayout(layouts, ctx, main) {
    const { layout, ...rest } = ctx;
    console.log('Rendering layout: ' + layout)
    if (layout) {
        if (!layouts[layout])
            throw new Error('Invalid layout valid ' + layout + '. Must be one of' + Object.keys(layouts).join())
        return render(layouts[layout], { ...rest, main }).html;
    }
    return main;
}
function renderPage(filePath, intCtx, layouts) {
    let { ctx, html } = renderFile(filePath, { ...intCtx, ...buildMetaData() });
    return wrapInLayout(layouts, ctx, html);
}
module.exports = renderPage;