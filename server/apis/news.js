const { News } = require('./../models/news');
const { ObjectID, _ } = require('./../server.js');


// addNews API
let addNews = (req, res) => {
  let reqBody = req.body;

  let news = new News({
    title: reqBody.title,
    short_description: reqBody.short_description,
    text: reqBody.text,
  });

  news.save().then((doc) => {
    res.status(201).send({message: 'Added successfully', added_item: doc});
  }, (e) => {
    if(e.message.indexOf('E11000 duplicate key error collection') >= 0)
      return res.status(400).send({message: 'Title already exists'});
    res.status(400).send(e);
  });
};


// listNews API
let listNews = (req, res) => {
  let reqHeaders = req.headers;
  let query = {}, sortArr = []
  let filter = {}, sort = {}

  try {
    if (reqHeaders.filter)
      filter = JSON.parse(reqHeaders.filter);
    if (reqHeaders.sort)
      sort = JSON.parse(reqHeaders.sort);
  } catch(e) {
    return res.status(400).send({message: 'Invalid headers'});
  }

  let titleFilter = filter.title;
  let dateFilter = filter.date;
  let titleSort = sort.title;
  let dateSort = sort.date;

  // headers validation
  if ( (titleFilter && typeof titleFilter != 'string') ||
       (dateFilter && typeof dateFilter != 'object' && dateFilter.from && dateFilter.to) ||
       (titleSort && !_.contains([-1, 1], titleSort)) ||
       (dateSort && !_.contains([-1, 1], dateSort)) )
     return res.status(400).send({message: 'Invalid headers'});

  if (titleFilter)
    query.title = { $regex: titleFilter, $options: 'i' }
  if (dateFilter)
    query.date = { $gte: dateFilter.from, $lte: dateFilter.to }

  if (titleSort)
    sortArr.push(['title', titleSort])
  if (dateSort)
    sortArr.push(['date', dateSort])

  News.find(query).sort(sortArr).then((news) => {
    res.send({news})
  }, (e) => {
    return res.status(400).send(e);
  });
};


// getOneOfNews API
let getOneOfNews = (req, res) => {
  let id = req.params.id;

  if (!ObjectID.isValid(id))
    return res.status(404).send();

  News.findById(id).then((doc) => {
    if (!doc)
      return res.status(404).send();
    res.send({...doc._doc});
  }).catch((e) => {
    res.status(400).send();
  });
};


// deleteOneOfNews API
let deleteOneOfNews = (req, res) => {
  let _id = req.params._id;

  if (!ObjectID.isValid(_id))
    return res.status(404).send();

  News.findOneAndDelete({_id}).then((doc) => {
    if (!doc)
      return res.status(404).send();
    res.send({message: 'Deleted successfully', deleted_item: doc});
  }).catch((e) => {
    res.status(400).send();
  });
};


// updateOneOfNews API
let updateOneOfNews = (req, res) => {
  let _id = req.params._id;
  let reqBody = req.body;
  let {title, short_description, text} = reqBody;
  let updateObj = {title, short_description, text}

  if (!ObjectID.isValid(_id))
    return res.status(404).send();

  for (key in updateObj){
    if (!updateObj[key])
      delete updateObj[key]
  }
  if (_.isEmpty(updateObj))
    return res.status(400).send({message: 'No data sent to be updated'});

  updateObj.updatedAt = new Date().getTime();

  News.findOneAndUpdate({_id}, { $set: updateObj } ).then((doc) => {
    if (!doc)
      return res.status(404).send();
    res.send({message: 'Updated successfully', updated_item: doc});
  }, (e) => {
    if(e.codeName == 'DuplicateKey')
      return res.status(400).send({message: 'Title already exists'});
    res.status(400).send(e);
  });
};



module.exports = {
  addNews,
  listNews,
  getOneOfNews,
  deleteOneOfNews,
  updateOneOfNews
}
