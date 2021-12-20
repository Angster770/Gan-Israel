const Ganisrael = require('../models/ganisrael')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async(req, res) => {
    const ganisraels = await Ganisrael.find({})
    res.render('ganisraels/index', { ganisraels })
}

module.exports.renderNewForm = (req, res) => {
    res.render('ganisraels/new')
}

module.exports.createGanisrael = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.ganisrael.location,
        limit: 1
    }).send()
    const ganisrael = new Ganisrael(req.body.ganisrael);
    ganisrael.geometry = geoData.body.features[0].geometry;
    ganisrael.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ganisrael.author = req.user._id;
    await ganisrael.save();
    console.log(ganisrael);
    req.flash('success', 'BH theres a new gan israel')
    res.redirect(`/ganisraels/${ganisrael._id}`)
}

module.exports.showGanisrael = async(req, res) => {
    const ganisrael = await Ganisrael.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('author');
    if (!ganisrael) {
        req.flash('error', 'Cant find your ganisrael');
        return res.redirect('/ganisraels');
    }
    res.render('ganisraels/show', { ganisrael });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const ganisrael = await Ganisrael.findById(id)
    if (!ganisrael) {
        req.flash('error', 'Cant find your ganisrael');
        return res.redirect('/ganisraels');
    }
    res.render('ganisraels/edit', { ganisrael });
}

module.exports.updateGanisrael = async(req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const ganisrael = await Ganisrael.findByIdAndUpdate(id, {...req.body.ganisrael });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    ganisrael.images.push(...imgs);
    await ganisrael.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await ganisrael.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfuly updated Gan Israel')
    res.redirect(`/ganisraels/${ganisrael._id}`)
}

module.exports.deleteGanisrael = async(req, res) => {
    const { id } = req.params;
    await Ganisrael.findByIdAndDelete(id);
    req.flash('success', 'successfuly deleted ganisrael')
    res.redirect('/ganisraels')
}