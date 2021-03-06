'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash'),
  path = require('path'),
  mongoose = require('mongoose'),
  Volunteer = mongoose.model('Volunteer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a Volunteer
 */
exports.create = function (req, res) {
  var volunteer = new Volunteer(req.body);
  volunteer.user = req.user;

  volunteer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteer);
    }
  });
};

/**
 * Show the current Volunteer
 */
exports.read = function (req, res) {
  res.jsonp(req.volunteer);
};

/**
 * Update a Volunteer
 */
exports.update = function (req, res) {
  var volunteer = req.volunteer;

  volunteer = _.extend(volunteer, req.body);

  volunteer.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteer);
    }
  });
};

/**
 * Delete a Volunteer
 */
exports.delete = function (req, res) {
  var volunteer = req.volunteer;

  volunteer.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteer);
    }
  });
};

/**
 * List of Volunteers
 */
exports.list = function (req, res) {
  Volunteer.find().sort('-created').populate('user', 'displayName').exec(function(err, volunteers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(volunteers);
    }
  });
};

/**
 * Volunteer middleware
 */
exports.volunteerByID = function (req, res, next, id) {

  Volunteer.findById(id).populate('user', 'displayName').exec(function (err, volunteer) {
    if (err) return next(err);
    if (! volunteer) return next(new Error('failed to load volunteer  ' + id));
    req.volunteer = volunteer;
    next();
  });
};

