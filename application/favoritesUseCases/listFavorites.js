let Favorites=require("../../domain/Favorites.js");
module.exports=async (favoritesContent,favoritesRepository)=>{
    let favorites=new Favorites(favoritesContent);
    let favoritesInfo;
    try {
        favoritesInfo=await favoritesRepository.listFavorites(favorites);
    } catch (error) {
        console.log(error);
    }
    return favoritesInfo;
}