import {SchoolTypes} from './SchoolTypes';
import {Colors} from './Colors';


export class EducationSite {
  name: string;
  longitude: number;
  latitude: number;
  radius: number;
  type: string;
  color: string;

  constructor(feature, type: string, radius: number) {

    //console.log(feature.geometry.location.lat);
    this.name = feature.name;
    this.type = type;
    this.latitude = feature.geometry.location.lat;
    this.longitude = feature.geometry.location.lng;
    this.radius = radius;


    if (type === SchoolTypes.primarySchool) {
      this.color = Colors.educationSitePrimarySchoolColor;
    } else if (type === SchoolTypes.middleSchool) {
      this.color = Colors.educationSiteMiddleSchoolColor;
    } else if (type === SchoolTypes.highSchool) {
      this.color = Colors.educationSiteHighSchoolColor;
    } else if (type === SchoolTypes.university) {
      this.color = Colors.educationSiteUniversityColor;
    } else {
      this.color = '#000000';
    }
  }
}


/*
{
         "formatted_address" : "Legon Boundary, Accra, Ghana",
         "geometry" : {
            "location" : {
               "lat" : 5.650562,
               "lng" : -0.1962244
            },
            "viewport" : {
               "northeast" : {
                  "lat" : 5.651911829892722,
                  "lng" : -0.1948745701072778
               },
               "southwest" : {
                  "lat" : 5.649212170107278,
                  "lng" : -0.1975742298927222
               }
            }
         },
         "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/school-71.png",
         "id" : "9a51b58632559d0de783152baa492d215d1865bd",
         "name" : "University of Ghana, Legon",
         "photos" : [
            {
               "height" : 2322,
               "html_attributions" : [
                  "\u003ca href=\"https://maps.google.com/maps/contrib/115787380353543108586/photos\"\u003eNana Yaa Owusu\u003c/a\u003e"
               ],
               "photo_reference" : "CmRaAAAAvassyf2TwtBjNCY3-1Gvn65fRg8jOe2E0GoCk0-qUCXV4iG4CuZyw7JKEKY7Nqc43dVYQCd36krGoiy6pjfLLoRsWdeiL-5Zp8L0_ZnbXGKoGVR0h2PwQyjYqnLNqut3EhAZs6pqVWNT1Lexn0hk6Aa_GhSPWcVfhYJD0TUzaMRiRpF7V3DN0Q",
               "width" : 4128
            }
         ],
         "place_id" : "ChIJk77qun6c3w8RoMGYdOZXgtc",
         "plus_code" : {
            "compound_code" : "MR23+6G Accra, Ghana",
            "global_code" : "6CQXMR23+6G"
         }
 */

