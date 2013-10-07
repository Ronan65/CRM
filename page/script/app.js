'use strict';

angular.module('myApp',['ngResource'])
	.controller('MainCtrl', ['$scope','serviceUpdate','serviceCustomerDB','serviceCustomerDBU','serviceGetStat', function ($scope, serviceUpdate, serviceCustomerDB, serviceCustomerDBU,serviceGetStat) {
		$scope.client;
		$scope.customer;
		$scope.listCustomer = serviceUpdate.query();
		$scope.dateDB = serviceGetStat.create();

		// Récupération du client dans la base approuvé et dans la base de demande de modification
		$scope.getChanges = function (idCust) {
			$scope.customerDB = serviceCustomerDB.get({id: idCust});
			$scope.customerDBU = serviceCustomerDBU.get({id: idCust});
		}

		// Validation des changements
		$scope.valideChanges = function (cust) {
			serviceUpdate.update({id: cust.customer._id},cust,function() {
            	window.location.reload();
          });
		}

		// Rejet des changement
		$scope.cancelChanges = function (cust) {
			serviceUpdate.erase({id: cust._id},cust,function() {
            	window.location.reload();
          });
		}
	}])
	// 4 Services : pour récupérer les données, pour envoyer les données et pour le chargement des stats.
	.factory('serviceUpdate', function($resource) {
	    return $resource('https://localhost:8443/db/update/:id',{id: '@id'},{
	    	'update': {method: 'PUT'},
	    	'erase': {method: 'DELETE'}
	    });
	})
	.factory('serviceCustomerDB',  function($resource) {
	    return $resource('https://localhost:8443/db/customerDB/:id',{id: '@id'});
	})
	.factory('serviceCustomerDBU',  function($resource) {
	    return $resource('https://localhost:8443/db/customerDBU/:id',{id: '@id'});
	})
	.factory('serviceGetStat',  function($resource) {
	    return $resource('https://localhost:8443/db/stat',{id: '@id'},{
	    	'create': {method: 'POST'}
	    });
	});