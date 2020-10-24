var middlewareObj = {};

middlewareObj.formatText = function(search){
	
	var reg = escapeRegex(search.toLowerCase());
	reg = removeAccents(reg);
	reg = diacriticSensitiveRegex(reg);
		
	const regex = new RegExp(reg, 'i');
	
	return regex;
}

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need login first");
	res.redirect("/login");
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function removeAccents(string = '') {
         return string.replace(new RegExp('[a,á,à,ä,ą,ã,â]','gi'), 'a')
            .replace(new RegExp('[e,é,è,ë,ê,ę]','gi'), 'e')
            .replace(new RegExp('[i,ï,î,í,ì]','gi'), 'i')
            .replace(new RegExp('[o,ó,ö,ò]','gi'), 'o')
			.replace(new RegExp('[c,ç,ć]','gi'), 'c')
			.replace(new RegExp('[y,ÿ]','gi'), 'y')
			.replace(new RegExp('[l,ł]','gi'), 'l')
			.replace(new RegExp('[n,ń]','gi'), 'n')
			.replace(new RegExp('[s,ś]','gi'), 's')
			.replace(new RegExp('[z,ź,ż]','gi'), 'z')
            .replace(new RegExp('[u,ü,ú,ù]','gi'), 'u');
    }

function diacriticSensitiveRegex(string = '') {
         return string.replace(/a/g, '[a,á,à,ä,ą,ã,â]')
            .replace(/e/g, '[e,é,è,ë,ê,ę]')
            .replace(/i/g, '[i,ï,î,í,ì]')
            .replace(/o/g, '[o,ó,ö,ò]')
			.replace(/c/g, '[c,ç,ć]')
			.replace(/y/g, '[y,ÿ]')
			.replace(/l/g, '[l,ł]')
			.replace(/n/g, '[n,ń]')
			.replace(/s/g, '[s,ś]')
			.replace(/z/g, '[z,ź,ż]')
            .replace(/u/g, '[u,ü,ú,ù]');
    }

module.exports = middlewareObj;