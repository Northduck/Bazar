module.exports=({config})=>{
    const i18n=require("i18n");
    i18n.configure({
        locales: config.get("supported_languages"),
        cookie: 'language',
        directory:`${__dirname}/../../locales`
    });
    return i18n;
}