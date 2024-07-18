## Getting Started

First, run the development server:

```bash
npm run server
# or
yarn server
# or
pnpm server
# or
bun server
```

Open [http://localhost:1000](http://localhost:1000) with your api checker like postman or else.

You can start editing the page by modifying `app.js`. The page auto-updates as you edit the file.


# LibraryManagement System

BackendTechnology:

```
● Node.jsandExpress:ThebackendisbuiltusingNode.jsandtheExpressframework.Thiscombination
providesarobustandscalableplatformforbuildingwebAPIs.
● MongoDB:MongoDBisusedastheNoSQLdatabaseforstoringandmanagingapplicationdata.
● CORS(Cross-OriginResourceSharing):CORSisimplementedtoallowauthorizedcross-originrequeststo
theAPI.ThisenablescommunicationbetweenyourfrontendapplicationandthebackendAPIeveniftheyare
hostedondifferentdomainsorsubdomains.
● Mongoose:MongooseisanObjectDataModeling(ODM)libraryforNode.jsandMongoDB.Itsimplifies
interactingwithMongoDBbyprovidingalayerofabstractionovertherawdatabaseoperations.Mongoose
allowsyoutodefinedatamodelsthatmaptoMongoDBcollectionsandprovidesmethodsforcreating,
reading,updating,anddeletingdata.
```
DataModels
ThissectiondescribesthedatamodelsusedbythebackendAPI.Thesemodelsdefinethestructureand
relationshipsbetweendatastoredintheMongoDBdatabase.

ModelLocation:

Allmodelschemafilesarelocatedwithinthemodelsdirectoryandarenamedafterthecorrespondingdataentity
(e.g.,book.js,transaction.js,user.js).Timestampsareusedtomaintainversioncontrolforthesefiles.

MongooseSchemas:

Mongooseisusedtodefinetheschemaforeachdatamodel.Here'sabreakdownofthefieldsforeachmodel:

1.BookModel:
```
● bookName(String,Required):Storesthenameofthebook.
● bookImage(String):StorestheURLofthebookcoverimage(optional).
● author(String,Required):Storesthenameofthebook'sauthor.
● bookStatus(String):Indicatestheavailabilityofthebook(e.g.,"available","notavailable").
● transactions(ObjectId,ref:"BookTransaction"):ReferencesanarrayofBookTransactionobjects
associatedwiththisbook.Thisestablishesaone-to-manyrelationshipbetweenBooksandTransactions.
```

2.BookTransactionModel:
```
● borrowerId(String,Required):StorestheIDoftheuserwhoborrowedthebook.
● bookName(String,Required):Storesthenameoftheborrowedbook.
● bookImage(String):StorestheURLoftheborrowedbookcoverimage(optional).
● borrowerEmail(String,Required):Storestheemailaddressoftheborrower.
● transactionType(String,Required):Indicatesthetypeoftransaction(e.g.,"borrowed","returned").
● fromDate(String,Required):Storesthedatethebookwasborrowed.
● toDate(String,Required):Storesthedatethebookisexpectedtobereturned.
● dueDate(String):Storestheduedateforreturningthebook(optional).
● transactionStatus(String):Indicatesthecurrentstatusofthetransaction(Active").
```

3.UserModel:

```
● userType(String,Required):Specifiestheusertype(e.g.,"admin","regular").
● userFullName(String,Required):Storesthefullnameoftheuser.
● gender(String):Storestheuser'sgender(optional).
● address(String):Storestheuser'saddress(optional).
● mobileNumber(Number):Storestheuser'smobilephonenumber.
● Photo(String):StorestheURLoftheuser'sprofilepicture(optional).
```

```
● Email(String,Required,Unique,MaxLength:50):Storestheuser'semailaddress.Enforcesuniqueness
andlimitsthemaximumlengthto 50 characters.
● Password(String,Required,MinimumLength:6):Storestheuser'spassword.Enforcesaminimumlength
of 6 characters.
● activeTransactions(ObjectId,ref:"BookTransaction"):ReferencesanarrayofBookTransactionobjects
wheretheuseriscurrentlyborrowingbooks(one-to-manyrelationship).
● prevTransactions(ObjectId,ref:"BookTransaction"):ReferencesanarrayofBookTransactionobjectsfor
theuser'spastborrowinghistory(one-to-manyrelationship).
● isAdmin(Boolean,Default:false):Aflagindicatingiftheuserisanadministrator(default:false).
```
## APIEndpoints

ThissectiondescribestheAPIendpointsavailableforinteractingwiththebackendfunctionalities.All
API-relatedJavaScriptfilesarelocatedwithinthe **routes** folder,namedafterthecorrespondingfunctionality

(e.g., **book.js** , **transaction.js** , **user.js** ).

Routing:

Themainapplicationfile( **app.js** )handlesroutingfortheseendpoints.Here'sabreakdownoftheroutesand
functionalities:

1.BookEndpoints(URIPrefix:/api/books):

```
● POST /addBook (JWTAuthenticationRequired):
○ Thisendpointallowsaddinganewbooktothesystem.
○ Authorization:RequiresavalidJWTtokenintherequestheader.
○ RequestBody:ExpectsdatafollowingtheBookmodelschema(refertoDataModelssection
fordetails).
○ SuccessResponse:Uponsuccessfulcreation,returnsthenewlycreatedbookdata.
● DELETE /deleteBook (JWTAuthenticationRequired):
○ Thisendpointallowsdeletingabookfromthesystem.
○ Authorization:RequiresavalidJWTtokenintherequestheader.
○ Request:ExpectsthebookIDintherequestbody.
○ SuccessResponse:Returnsaconfirmationmessageuponsuccessfuldeletion.
● GET /getBook (Public):
○ Thisendpointretrievesinformationforallavailablebooks.
○ Authorization:Noauthenticationrequired(publicendpoint).
○ Response:Returnsanarraycontainingallbookdata.
● GET /getRecentBook (Public):
○ Thisendpointretrievesinformationforrecentlyaddedbooks.
○ Authorization:Noauthenticationrequired(publicendpoint).
○ Response:Returnsanarraycontainingrecentlyaddedbookdata.
● PUT /bookAvailability (JWTAuthenticationRequired):
○ Thisendpointallowsupdatingtheavailabilitystatusofabook.
○ Authorization:RequiresavalidJWTtokenintherequestheader.
○ RequestHeader:ExpectsthebookID.
○ RequestBody:Expectstheupdatedavailabilitystatus.
○ SuccessResponse:Returnsaconfirmationmessageuponsuccessfulupdate.
```
2.TransactionEndpoints(URIPrefix:/api/transaction):

```
● POST /add-Allocation (JWTAuthenticationRequired-AdminOnly):
```

```
○ Thisendpointallowsallocatingabooktoauser(borrowing).
○ Authorization:RequiresavalidJWTtokenwithadminprivilegesintherequestheader.
○ RequestBody:ExpectsdatafollowingtheTransactionmodelschema(refertoDataModels
sectionfordetails).
○ SuccessResponse:Returnsthenewlycreatedtransactiondatauponsuccessfulallocation.
● GET /all-allocation (JWTAuthenticationRequired-AdminOnly):
○ Thisendpointretrievesalistofallbookallocations(borrowings)sortedbydate(descending
order).
○ Authorization:RequiresavalidJWTtokenwithadminprivilegesintherequestheader.
○ Response:Returnsanarraycontainingalltransactiondatasortedbyallocationdate(latest
first).
● PUT /update-allocation (JWTAuthenticationRequired-AdminOnly):
○ Thisendpointallowsupdatinganexistingbookallocation(borrowing).
○ Authorization:RequiresavalidJWTtokenwithadminprivilegesintherequestheader.
○ RequestBody:ExpectstheupdatedtransactiondatafollowingtheTransactionmodelschema.
○ SuccessResponse:Returnsaconfirmationmessageuponsuccessfulupdate.
● GET /find-active-allocation (JWTAuthenticationRequired-AdminOnly):
○ Thisendpointretrievesalistofallcurrentlyactivebookallocations(ongoingborrowings).
○ Authorization:RequiresavalidJWTtokenwithadminprivilegesintherequestheader.
○ Response:Returnsanarraycontainingdataforallactivebookallocations.
```
3.UserEndpoints(URIPrefix:/api/user):

```
● POST /signup (JWTAuthenticationRequired-AdminOnly):
○ Thisendpointallowscreatinganewuseraccount.
○ Authorization:RequiresavalidJWTtokenwithadminprivilegesintherequestheader.
○ RequestBody:ExpectsdatafollowingtheUsermodelschema(refertoDataModelssection
fordetails),includingusertype(adminorregular).
○ SuccessResponse:Returnsthenewlycreateduserdata.
● POST /signin (Public):
○ Thisendpointallowsuserstosignintotheapplication.
○ Authorization:Noauthenticationrequired(publicendpoint).
○ RequestBody:Expectsuseremail
```

