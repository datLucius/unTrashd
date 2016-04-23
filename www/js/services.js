angular.module('app.services', [])



.factory('geoLocationService', ['$q', '$http', function($q, $http){

  var getLocation = function() {

    var defer = $q.defer();

    if (navigator.geolocation) {

                  //
                  navigator.geolocation.getCurrentPosition(function(position){

                      var result = {latitude : position.coords.latitude , longitude : position.coords.longitude}
                      console.log(result);

                    }, function(error){

                                        defer.reject({message: error.message, code:error.code});

                                    }, {
                                      timeout: 120 * 1000,
                                      maximumAge: 10 * 60 * 1000,
                                      enableHighAccuracy: false,
                                    });
                                }
                                else {
                                    defer.reject({error: 'Geolocation not supported'});
                                }

                                return defer.promise;
                            }

                            var service = {
          getLocation : getLocation
      };

      return service;
        }])


  .factory('itemService', function($q, $http) {

        var _db;
        var _items;
      //  var _scansUrl = 'https://trans-fats.herokuapp.com/api/scans';

        return {
            initDB: initDB,
            getAllItems: getAllItems,
            addItem: addItem,
            updateItem: updateItem,
            deleteItem: deleteItem,
            postLeftItems: postLeftItems
            //deletePost: deletePost
        };

        function initDB() {
            // Creates the database or opens if it already exists
            _db = new PouchDB('trash', {adapter: 'websql', auto_compaction: true});
            if (typeof window != "undefined") {window.PouchDB = PouchDB};
        };

        function addItem(item) {
        //  console.log("addServices");
            return $q.when(_db.post(item));
            $state.go($state.current, $stateParams, {reload: true, inherit: false});
            console.log("Item added", item._id);

        };

        function updateItem(item) {
          console.log("updating");
            return $q.when(_db.put(item));
        };

        function deleteItem(item) {
          console.log("delete");
            return $q.when(_db.remove(item));
            $state.go($state.current, $stateParams, {reload: true, inherit: false});
          //  $window.location.reload(true);
            //$scope.apply();
        };

        function getAllItems() {

            if (!_items) {
                return $q.when(_db.allDocs({ include_docs: true}))
                          .then(function(docs) {
                            console.log("the docs", docs);

                            // Each row has a .doc object and we just want to send an
                            // array of item objects back to the calling controller,
                            // so let's map the array to contain just the .doc objects.
                            _items = docs.rows.map(function(row) {
                                // Dates are not automatically converted from a string.
                              //  row.doc.Date = new Date(row.doc.Date);
                                return row.doc;
                            });

                            // Listen for changes on the database.
                            _db.changes({ live: true, since: 'now', include_docs: true})
                               .on('change', onDatabaseChange);
                           return _items;
                         });
            } else {
                // Return cached data as a promise
                return $q.when(_items);
            }
        };


        function onDatabaseChange(change) {
            console.log("db change", change.doc);
              var index = findIndex(_items, change.id);
               var item = _items[index];
              console.log("item id", item._id);
              console.log("item", item);

////////TO DO/// WHEN CONNECTED TO API/////////
  //             if(!change.deleted) {
  //               $http({
  //          method: 'POST',
  //          url: 'https://trans-fats.herokuapp.com/api/scans',
  //          headers: {'Content-Type' : 'application/json', 'Authorization' : token},
  //          data: {"data":[{
  //            "user_id": 1,
  //            "scan_date": change.doc.scan_date,
  //            "received_date": change.doc.received_date,
  //            "division_id": "South",
  //            "department_id": change.doc.department_id,
  //            "category_id": parseInt(change.doc.category_id),
  //            //"location_id": parseInt($scope.form.location_id),
  //            "location_id": 1,
  //            "person_responsible_id": parseInt(change.doc.person_responsible_id),
  //            "barcode": change.doc.barcode,
  //            "description": change.doc.description,
  //            "old_asset_number": change.doc.old_asset_number,
  //            "condition": "GD",
  //            "warranty": change.doc.warranty,
  //            "make": change.doc.make,
  //            "model": change.doc.model,
  //            "serial_number": change.doc.serial_number}]
  //                }
  //        })
  //        .success(function(data, status) {
  //           console.log(status)
  //           console.log(data);
  //
  //        })
  //        .error(function(error){
  //          console.log(error);
  //        })
  //
  //        .then(function (res) { return _db.remove(change.doc) })
  //
  // }

              if (change.deleted) {
                  if (item) {
                      _items.splice(index, 1); // delete
                  }
              } else {
                  if (item && item._id === change.id) {
                      _items[index] = change.doc; // update
                  } else {
                      _items.splice(index, 0, change.doc) // insert
                  }
             }
      }

          function findIndex(array, id) {
            var low = 0, high = array.length, mid;
          //  console.log(id);
            while (low < high) {
              mid = (low + high) >>> 1;
              array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
          }

///////////////////////!!!!!!!!!!!!!!!!!!!!!!!!!!!////////
/////// TO DO//// WHEN USER IN WIFI RANGE SYNC ITEMS TO API///////
          function postLeftItems(items) {

          console.log(items);

          var strings = JSON.stringify(items);
          console.log(items);

            $http({
          method: 'POST',
          url: 'https://trans-fats.herokuapp.com/api/scans',
          headers: {'Content-Type' : 'application/json', 'Authorization' : token},
        //  data: {"data": strings} /// 500 internal server error
          //  data: strings //// 401 unauthorized error
          data: JSON.stringify(items)  /// 401 unauthorized error
          })

          };

/////////////////////////////////////////




  })
