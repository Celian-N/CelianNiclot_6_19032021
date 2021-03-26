const Sauce = require('../models/sauces');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({ message: 'Sauce supprimée !' });
          })
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.handleLikeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauceObject) => {
      const sauce = {
        likes: sauceObject.likes,
        dislikes: sauceObject.dislikes,
        usersLiked: sauceObject.usersLiked,
        usersDisliked: sauceObject.usersDisliked,
      };

      switch (req.body.like) {
        case -1:
          sauce.dislikes += 1;
          sauce.usersDisliked.push(req.body.userId);

          break;
        case 0:
          if (sauce.usersLiked.indexOf(req.body.userId) !== -1) {
            const index = sauce.usersLiked.indexOf(req.body.userId);
            sauce.likes -= 1;
            sauce.usersLiked.splice(index, 1);
          } else if (sauce.usersDisliked.indexOf(req.body.userId) !== -1) {
            const index = sauce.usersDisliked.indexOf(req.body.userId);
            sauce.dislikes -= 1;
            sauce.usersDisliked.splice(index, 1);
          }
          break;
        case 1:
          sauce.likes += 1;
          sauce.usersLiked.push(req.body.userId);

          break;
        default:
          break;
      }
      updateSauce(sauce);
    })
    .catch((error) => res.status(400).json({ error }));

  const updateSauce = (sauce) => {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        likes: sauce.likes,
        dislikes: sauce.dislikes,
        usersLiked: sauce.usersLiked,
        usersDisliked: sauce.usersDisliked,
      }
    )
      .then(() =>
        res.status(200).json({
          message: req.body.like == -1 ? 'Sauce Dislikée' : 'Sauce Likée',
        })
      )
      .catch((error) => res.status(500).json({ error }));
  };
};
