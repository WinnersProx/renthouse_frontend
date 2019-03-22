Posting Form Data With $http In AngularJS
By Ben Nadel on April 23, 2014
Tags: Javascript / DHTML
By default, when you go to post data in an AngularJS application, the data is serialized using JSON (JavaScript Object Notation) and posted to the server with the content-type, "application/json". But, if you want to post the data as a regular "form post," you can; all you have to do is override the default request transformation.

When you define an AJAX (Asynchronous JavaScript and XML) request in AngularJS, the $http service allows you to define a transform function for both the outgoing request and the incoming response. These are optional; and, by default, AngularJS provides transform functions that deal with JSON. This is a very flexible format because the post data can have an arbitrarily nested structure; but, it requires additional processing on the server.

If you want to post the data as a regular form post, two things need to happen:

The content-type needs to be reported as "application/x-www-form-urlencoded".
The data needs to be serialized using "key=value" pairs (much like a query string).
Both of these requirements can be fulfilled within a request transform function, which has access to the outgoing headers collection and the non-serialized data. The goal of the transform function is to update the headers (as needed) and to return the modified data that will be injected into the underlying XMLHttpRequest object.

I didn't find a serialization function in AngularJS that was designed for form-posts; so, I copied(ish) the .param() implementation in jQuery. In the following demo, I'm posting the data using this transform function. The server is then dumping out the content of the FORM scope and returning it in the result, which we are rending on the page.

<!doctype html>
<html ng-app="Demo">
<head>
<meta charset="utf-8" />
 
<title>
Posting Form Data With $http In AngularJS
</title>
</head>
<body ng-controller="DemoController">
 
<h1>
Posting Form Data With $http In AngularJS
</h1>
 
<div ng-bind-html="cfdump">
<!-- To be populated with the CFDump from the server. -->
</div>
 
 
<!-- Initialize scripts. -->
<script type="text/javascript" src="../jquery/jquery-2.1.0.min.js"></script>
<script type="text/javascript" src="../angularjs/angular-1.2.4.min.js"></script>
<script type="text/javascript">
 
// Define the module for our AngularJS application.
var app = angular.module( "Demo", [] );
 
 
// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// I control the main demo.
app.controller(
"DemoController",
function( $scope, $http, transformRequestAsFormPost ) {
 
// I hold the data-dump of the FORM scope from the server-side.
$scope.cfdump = "";
 
// By default, the $http service will transform the outgoing request by
// serializing the data as JSON and then posting it with the content-
// type, "application/json". When we want to post the value as a FORM
// post, we need to change the serialization algorithm and post the data
// with the content-type, "application/x-www-form-urlencoded".
var request = $http({
method: "post",
url: "process.cfm",
transformRequest: transformRequestAsFormPost,
data: {
id: 4,
name: "Kim",
status: "Best Friend"
}
});
 
// Store the data-dump of the FORM scope.
request.success(
function( html ) {
 
$scope.cfdump = html;
 
}
);
 
}
);
 
 
// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// I provide a request-transformation method that is used to prepare the outgoing
// request as a FORM post instead of a JSON packet.
app.factory(
"transformRequestAsFormPost",
function() {
 
// I prepare the request data for the form post.
function transformRequest( data, getHeaders ) {
 
var headers = getHeaders();
 
headers[ "Content-type" ] = "application/x-www-form-urlencoded; charset=utf-8";
 
return( serializeData( data ) );
 
}
 
 
// Return the factory value.
return( transformRequest );
 
 
// ---
// PRVIATE METHODS.
// ---
 
 
// I serialize the given Object into a key-value pair string. This
// method expects an object and will default to the toString() method.
// --
// NOTE: This is an atered version of the jQuery.param() method which
// will serialize a data collection for Form posting.
// --
// https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
function serializeData( data ) {
 
// If this is not an object, defer to native stringification.
if ( ! angular.isObject( data ) ) {
 
return( ( data == null ) ? "" : data.toString() );
 
}
 
var buffer = [];
 
// Serialize each key in the object.
for ( var name in data ) {
 
if ( ! data.hasOwnProperty( name ) ) {
 
continue;
 
}
 
var value = data[ name ];
 
buffer.push(
encodeURIComponent( name ) +
"=" +
encodeURIComponent( ( value == null ) ? "" : value )
);
 
}
 
// Serialize the buffer and clean it up for transportation.
var source = buffer
.join( "&" )
.replace( /%20/g, "+" )
;
 
return( source );
 
}
 
}
);
 
 
// -------------------------------------------------- //
// -------------------------------------------------- //
 
 
// I override the "expected" $sanitize service to simply allow the HTML to be
// output for the current demo.
// --
// NOTE: Do not use this version in production!! This is for development only.
app.value(
"$sanitize",
function( html ) {
 
return( html );
 
}
);
 
</script>
 
</body>
</html>
Notice that the call to the $http service is basically unchanged. The only difference, from a normal post, is that we are explicitly passing-in the "transformRequestAsFormPost" function as the "transformRequest" configuration option.

When we run the above code, we get the following page output:


 
 
 

 
 Posting Form data in an AngularJS application.	 
 
 
 
As you can see, the outgoing request data was serialized for consumption as a regular form post.

NOTE: This does not use the "multipart/form-data" content type, which is primarily used for form posts that include binary file uploads.

In general, I like posting data as JSON. But, it does require some preprocessing on the server. Sometimes, it's nice to just to deal with normal form data that the server can consume automatically. It's nice that AngularJS is flexible enough to use both formats.

Tweet This
Deep thoughts by @BenNadel - Posting Form Data With $http In AngularJS

Enjoyed This? You Might Also Enjoy Reading:
AngularJS Will Parse JSON Payloads In Non-2xx HTTP Responses
Simulating Network Latency In AngularJS With $http Interceptors And $timeout
Monitoring $http Activity With $http Interceptors In AngularJS
Parsing AngularJS Request Data On The Server Using ColdFusion
Aborting AJAX Requests Using $http And AngularJS
httpi - A Lightweight $resource-Inspired Module For AngularJS
Using URL Interpolation With $http In AngularJS
Using The $http Service In AngularJS To Make AJAX Requests
My Experience With AngularJS - The Super-heroic JavaScript MVW Framework

CutterApr 23, 2014 at 2:03 PM 21 Comments
Great post Ben. What's the advantage of using this over angular's built-in $http.post()?

Ben NadelApr 23, 2014 at 2:07 PM 13,678 Comments
@Cutter,

The $http.post() method is just a convenience method for the $http service - it still posts the data as a JSON body. This approach changes the actual serialization of the data.

Personally, I like the way AngularJS does it (JSON) - it's more flexible. But, it was just something I ran into while testing features. I like to document what I find :D

Raymond CamdenApr 24, 2014 at 12:42 AM 350 Comments
Am I crazy, or is that *way* overly complex for something that should be built in? I mean, a form post isn't some weird API - compared to a JSON packet, it is *more* common.

Ben NadelApr 25, 2014 at 7:12 AM 13,678 Comments
@Ray,

I have mixed feelings about this. When I look at how I have historically posted data with AngularJS, it is pretty much always a collection of name-value pairs that would work perfectly well as a Form post. But, I do have a number of places where the JSON object works nicely; the one that pops to mind is passing an array of IDs:

{ userIDs: [ 1, 2, 3, 4 ] }

This is one of those things that jQuery would serialize "ok" as a Form post; but, the approach to the serialization, even in the context of jQuery, has changed over time.... since there's no standard on what format to use with arrays.

Of course, could have just create a list:

{
userIDs: ids.join( "," )
}

... and then ColdFusion could use one of the many List functions, or even converted to an array with listToArray().

Anyway, all to say that most of my data is Form-post-ready; but not all of it. So, once you get the boilerplate in for the data-type conversion on the server-side, it is more flexible.

That said, if you've only ever dealt with Form data, it's definitely *confusing* as to why your data wont parse!! It definitely threw me through a loop when I first tried it in jQuery:

www.bennadel.com/blog/2207-posting-json-data-to-the-coldfusion-server-using-jquery.htm

Ben NadelApr 25, 2014 at 7:13 AM 13,678 Comments
@All,

On a related note, I did just add a quick post about *how* to parse the AngularJS data that gets posted using JSON:

www.bennadel.com/blog/2617-parsing-angularjs-request-data-on-the-server-using-coldfusion.htm

SoyukaApr 28, 2014 at 8:21 AM 1 Comments
@raymon: this is also a solution to avoid jQuery $.params (http://scotch.io/tutorials/javascript/submitting-ajax-forms-the-angularjs-way) for example.

The fact is that PHP does not parse the JSON datas sent from angular into the $_POST. If you want angularjs $http.post() to work out of the box, you'll need some workarounds on the back-end.

Andre da Silva MedeirosMay 26, 2014 at 9:03 AM 1 Comments
Hey Ben, great post.

One question: Wouldn't you have problems with

if ( ! angular.isObject( data ) ) {
return( ( data == null ) ? "" : data.toString() );
}

snnipet?

On my tests, angular always send data as string "{\"name\":\"andre\",\"value\":\"1\"}",

which means return will be: "( data == null ) ? "" : data.toString()".

I have to change it by this and worked:

try {
data = JSON.parse(data);
} catch(e) {
return( ( data == null ) ? "" : data.toString() );
}

Am I missing something?

sohaibJun 3, 2014 at 12:02 PM 3 Comments
where is process.cfm

no result found just title?

Raymond CamdenJun 3, 2014 at 12:04 PM 350 Comments
@Sohaib,

process.cfm is just a ColdFusion script that outputs the form values.

sohaibJun 3, 2014 at 2:42 PM 3 Comments
Then Please guide me how I can or give email me that script. I also want to know. Whats the difference between above code and angularJS transformResponse?

Is angularJS has builtin functionality of transformRequest?

I we can achieve the above output using any angularJS function?

Raymond CamdenJun 3, 2014 at 3:14 PM 350 Comments
@Sohaib,

I don't think you understand. The whole point of this article is how to get Angular to POST form data in a name/value type method, how forms are normally posted. The server-side code is 100% inconsequential to that purpose. Ben showed an example in ColdFusion of simply echoing the form data back out to screen. You could do the same with PHP, Node, etc.

sohaibJun 4, 2014 at 9:27 AM 3 Comments
ok thanks.

I have writen the authenticate method in restfull api.
In my login form with angularJS. I get these values and hit the restfull api url to authenticate. here when i hit the url the angularJS encode these field data into json and send the values. but i do not want to encode these values into json. 
Is it make any sense to do this?
If not please explain little bit

Raymond CamdenJun 4, 2014 at 9:55 AM 350 Comments
I believe then what Ben describes here is what you would need.

ManikantaJun 5, 2014 at 3:54 AM 1 Comments
There is a small typo while setting the Content-Type header. You are setting 'Content-type' (mind the lowercase '-type').

This is causing issue as AngularJs $http will put Content-Type header to application/json and in this request transformer, you are setting Content-type and effectively ending up with some thing like, Content-Type=application/json; charset=UTF-8; application/x-www-form-urlencoded; charset=UTF-8

Thanks

MirkoJun 22, 2014 at 11:51 AM 1 Comments
@Manikanta,

Great! That little issue was freaking me out. On Firefox was working though.

MikhailJun 26, 2014 at 2:57 AM 1 Comments
Hi! Your example not working with insert object in data.
{
test: 'somevar'
array: [1,2,3],
insert: {test: 1, test2: 2}
}

I have dirty solution, maybe it's can help:

function myTransformRequest ( data, name ) {
var result = ''
, prefix = name || '';

if ( angular.isArray(data) ) {
if ( name ) {
prefix += '[';
}

for ( var key in data ) {
var val = data[key];

if ( angular.isObject(val) ) {
result += myTransformRequest(val, prefix + key + ']');
}else{
result += prefix + key + ']';
result += '='+val + '&';
}
}

return result;
}

if ( angular.isObject(data) ) {
if ( name ) {
prefix += '.';
}

for ( var key in data ) {
if ( angular.isFunction(data[key]) ) { break; }
if ( !data.hasOwnProperty(key) ) { break; }

if (key.charAt(0) === '$') {
break;
}

var val = data[key];

if ( angular.isObject(val) ) {
result += myTransformRequest(val, prefix + key);
}else{
result += prefix + key;
result += '='+val + '&';
}
}

return result;
}

return data;
}

JavierJJun 30, 2014 at 9:52 AM 1 Comments
@Manikanta,

Thanks for pointing it out! The original code works fine in firefox but I found the strange behaviour while testing Android browser.

Cheers

Mehul TJun 30, 2014 at 11:02 AM 1 Comments
Found a small bug due to which above would not work with ASP.NET forms OR http handler or MVC web API post.

The

headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";

should be

headers["Content-Type"] = "application/x-www-form-urlencoded; charset=utf-8";

The "t" in "Content-type" should be capital "T"

:)

JoaoJul 17, 2014 at 11:26 PM 1 Comments
THANK YOU THANK YOU!

After 3 HOURS banging my head against the wall cussing at ColdFusion, I finally found your post. This has saved me and it's so easy to use!

True, what others say, you need to just fix the typo with the "Content-Type" but... thank you!!!

Eder LimaAug 4, 2014 at 1:34 PM 1 Comments
Hi Ben.
I've looking for something like you got, but i'm using it in a little form inside a hotspot for free internet access, as login form.

The backend uses common form data, so your approach is perfect for me, thanks.

Can i ask you something?

Can i use the funcion "fromJson()" to deserialize and transform the request?
(https://docs.angularjs.org/api/ng/function/angular.fromJson)

I'm new on Angular and i'm trying to not use jQuery within this form...

Thanks! ;)

Maureen MooreAug 8, 2014 at 6:48 PM 2 Comments
How tall are you?

SonymonSep 5, 2014 at 6:43 AM 1 Comments
Hi Ben,
This is really helpful. Great work. But I am facing a strange problem, while requesting an GET api with "Content-type" = "application/x-www-form-urlencoded; which is intended to return a token, using the above code it is successfully calling the api but the response ain't getting into the success callback method of $http, but by observing the 'same' http request on fiddler, I am getting my intended response as json. Please help with this stuff.
Thanks

Pankaj Kumar JhaSep 16, 2014 at 6:23 AM 1 Comments
I was looking for "Posting Form Data With $http In AngularJS without jquery plugins". Below is my script..it may help the developer who are not interested to use jquery with angularJs.

angular.module('LMS.services', []).
factory('gcAPIservice', function($http) {
var gcAPI = {};

gcAPI.saveBookData = function(isbn, title, author, qty, price, status, comment) {
var datas = { isbn : isbn, title : title, author : author, qty : qty, price : price, status : status, comment : comment };

Object.toparams = function ObjecttoParams(obj) {
var p = [];
for (var key in obj) {
p.push(key + '=' + obj[key]);
}
return p.join('&');
};

return $http({
method: 'POST', 
url: '/LMS/php/book.php?t='+timestamp,
data : Object.toparams(datas),
headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});
};
return gcAPI;
});

Allen UnderwoodSep 24, 2014 at 6:02 PM 1 Comments
@Manikanta,
I had the same problem...@ben-nadel if you're still monitoring this, this article was extremely helpful but the Content-type typo caused a bit of problems. It should be Content-Type (caps "T"ype). Hopefully others will see this before pulling their hair out! :-)

Thanks for the article...very helpful.

JavzSep 30, 2014 at 9:36 PM 1 Comments
Bug on Chrome:

The typo on the Content-type : lowecase 't' prevents the form from posting with the set Content-Type on Chrome.

Just incase someone else runs into this or I missed it on the comments above.

PabloOct 1, 2014 at 11:37 AM 1 Comments
@Pankaj Kumar,

Dude... thank you very much this is exactly what I needed (Posting Form Data With $http In AngularJS without jquery plugins).

Thanks from Guatemala :)

MichaelNov 12, 2014 at 11:42 AM 3 Comments
Hi,

Thank you for the great solution.

One small thing I wanted to add:

on line 121 you can use:

angular.forEach(data, function(value, name) { ... })

and drop the following lines:

if (!data.hasOwnProperty( name ) ) {
continue;
}
var value = data[ name ];

Michael

NadavDec 9, 2014 at 8:22 AM 2 Comments
Great Article! And great code. 
Used it and modified a bit to adapt to a domain specific issue.

Thanks Ben!

NadavDec 9, 2014 at 8:25 AM 2 Comments
@Michael,

Not sure it'll work as angular.foreach runs async as opposed to a for() loop and so the next line:
var source = buffer ...

won't have buffer fully ready by the time it runs.

MichaelDec 9, 2014 at 9:46 AM 3 Comments
@Nadav,

I am pretty sure that 'angular.forEach()' is synchronous.

Here is a plunker, check out the console:
http://plnkr.co/edit/c29H9Lmc2bQkzn7sj800?p=preview

Carl ZetterbergDec 14, 2014 at 1:47 PM 1 Comments
Ben,
Thank you for this solution. Works great.
I use it with Mobile Angular UI

SimoneJan 7, 2015 at 6:47 AM 1 Comments
Hi,
I use this code and it work great on chrome.
But when i use firefox i've got "Bad Request" error.

What's the problem?

Thanx
Simone

Sonny NguyenJan 13, 2015 at 3:32 AM 2 Comments
in 2009 I was here for reading about css and some javascript posts on your blog and today I return here for reading how the way you works with Angularjs, You are good Ben :3

Gaurav soniFeb 16, 2015 at 3:40 AM 1 Comments
Hello, thanks for the article.
Question: i am running a simple http python server on my computer for testing. i did the following but my JSON file does not change , why is this ?

$http({
method: 'POST',
url: '../../resources/json/myJson.json',
data: "Put in something !!",
headers: {'Content-Type': 'application/x-www-form-urlencoded'}
});

NugoFeb 27, 2015 at 6:44 AM 1 Comments
What about multiselect?

Ty CahillMar 5, 2015 at 4:16 PM 3 Comments
I ran into a problem when posting an array of values because they got submitted as a comma delimited list. If any of the values had commas in them, things fell apart.

To fix it, I added some quick tweaks to the serializeData function to check for arrays and output them as multiple parameters with the same name. It's available in jsFiddle. Note that a polyfill for isArray starts on line 4, and the code that checks for arrays is on line 24.

http://jsfiddle.net/tycahill/pxtmcran/

Ty CahillMar 5, 2015 at 4:17 PM 3 Comments
@Nugo, the changes I made for properly handling arrays should fix your multi-select problem. See http://jsfiddle.net/tycahill/pxtmcran/

JeffMar 20, 2015 at 2:41 PM 1 Comments
Thanks Ben, for this and all your other blog posts. Very helpful and insightful for anyone learning Angular.

jarryMay 14, 2015 at 3:44 PM 1 Comments
gracias cabeza, thanks =D

paranoidxeJun 3, 2015 at 9:01 PM 2 Comments
lean it thanks

tarun jadavJun 27, 2015 at 3:37 PM 1 Comments
I have write below code in html but getting error of "The page you are looking for cannot be displayed because an invalid method (HTTP verb) is being used."

in my html:
<form name="payment" action="{{vm.resource.authEndpoint+ '/Payment/SecondOpinionCasePayment'}}" method="post">

in html page source:
<form name="payment" action="" method="post" class="ng-pristine ng-invalid ng-invalid-required">

I am not understated that Why action is going black. what is alternate for form post?