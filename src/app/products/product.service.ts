import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/Observable/throw';
import 'rxjs/Observable/from';
import {Observable} from "rxjs/Observable";
import * as Rx from 'rxjs/Rx'
export interface Variation {
  name : string;
  id : number;
}

//TODO add displayOrder. type = dropdown , textbox, radio , checkbox, colorsquare, imagesquare
export interface Attributes {
  attributeId : number;
  attributeName : string;
  attributeType : string;
  attributeTypeId : number;
  values : string[];
  displayOrder : number;
}

// TODO add displayOrder , showOnProduct page, allow filtering
export interface Specifications {
  attributeType : string;
  attributeName : string;
  attributeValue : string;
  showOnProductPage : boolean;
  displayOrder : number;
}

export interface Product {
  _id : number;
  title : string;
  shortDescription : string;
  description : string;
  price : number;
  onSale : boolean;
  tags : string[];
  showOnHomePage : boolean;
  markAsNew : boolean; // display under new products
  ratings : number;
  allowReviews : boolean;
  totalReviews : number;
  sku : number;
  stockQuantity : number;
  displayStockAvailability : boolean;
  displayStockQuantity : boolean;
  notifyQuantityBelow : boolean;
  displayOrder : number;
  published : boolean;
  relatedProducts : Product[];
  attributes : Attributes[];
  specifications : Specifications[];
  categories : string;
}

class ProductNotFoundException extends Error {
  constructor(message? : string) {
    super(message);
  }
}


@Injectable()
export class ProductService {
  constructor() {

  }

  variations : Variation[] = [
    {
      name : "Size",
      id : 1
    },
    {
      name : "Fabric",
      id : 2
    },
    {
      name : "Color",
      id : 3
    },
    {
      name : "Style",
      id : 4
    },
    {
      name : "Pattern",
      id : 5
    },
    {
      name : "Dimensions",
      id : 6
    }
  ];

  /*products: Product[] = [
    { id: '1', categoryId: '1', title: 'Baguette/ French Bread', price: 1.5, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Great eaten fresh from oven. Used to make sub sandwiches, etc.'
    },
    { id: '2', categoryId: '1', title: 'Croissants', price: 0.5, isSpecial: true,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'A croissant is a buttery, flaky, viennoiserie-pastry named for its well-known crescent shape.'
    }, // Takeaway
    { id: '3', categoryId: '2', title: 'Pizza', price: 1.2, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Pizza is a flatbread generally topped with tomato sauce and cheese and baked in an oven.'
    }, // Dairy
    { id: '4', categoryId: '3', title: 'Milk', price: 1.7, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Milk is a pale liquid produced by the mammary glands of mammals'
    },
    { id: '5', categoryId: '3', title: 'Cream Cheese', price: 2.35, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Cream cheese is a soft, mild-tasting fresh cheese with a high fat content.'
    }, // Meat
    {
      id: '6', categoryId: '4', title: 'Pork Tenderloin', price: 5.60, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The pork tenderloin, in some countries called pork fillet, is a cut of pork. '
    },
    { id: '7', categoryId: '4', title: 'Ribs, Baby Back', price: 4.85, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Pork ribs are a cut of pork popular in North American and Asian cuisines. '
    },
    { id: '8', categoryId: '4', title: 'Ground Beef', price: 9.20, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Ground beef, beef mince, minced beef, ' +
      'minced meat is a ground meat made of beef that has been finely chopped with a large knife or a meat grinder.'
    }, // Seafood
    { id: '9', categoryId: '5', title: 'Tuna', price: 3.45, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'A tuna is a saltwater finfish that belongs to the tribe Thunnini, a sub-grouping of the mackerel family - which together with the tunas, also includes the bonitos, ackerels, and Spanish mackerels.'
    },
    { id: '10', categoryId: '5', title: 'Salmon', price: 4.55, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Salmon is the common name for several species of ray-finned fish in the family Salmonidae.'
    },
    { id: '11', categoryId: '5', title: 'Oysters', price: 7.80, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The word oyster is used as a common name for a number of different families of saltwater clams, bivalve molluscs that live in marine or brackish habitats.'
    },
    { id: '12', categoryId: '5', title: 'Scalops', price: 2.70, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Scallop is a common name that is primarily applied to any one of numerous species of saltwater clams or marine bivalve mollusks in the taxonomic family Pectinidae, the scallops.'
    }, // Fruit & Veg
    { id: '13', categoryId: '6', title: 'Banana', price: 1.55, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The banana is an edible fruit, botanically a berry, produced by several kinds of large herbaceous flowering plants in the genus Musa.'
    },
    { id: '14', categoryId: '6', title: 'Cucumber', price: 1.05, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'Cucumber is a widely cultivated plant in the gourd family, Cucurbitaceae. '
    },
    { id: '15', categoryId: '6', title: 'Apple', price: 0.80, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The apple tree is a deciduous tree in the rose family best known for its sweet, pomaceous fruit, the apple.'
    },
    { id: '16', categoryId: '6', title: 'Lemon', price: 3.20, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The lemon is a species of small evergreen tree native to Asia.'
    },
    { id: '17', categoryId: '6', title: 'Pear', price: 4.25, isSpecial: false,
      imageL: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=1110%C3%97350&w=1100&h=350',
      imageS: 'https://placeholdit.imgix.net/~text?txtsize=33&bg=373a3c&txtclr=ffffff&txt=270%C3%97150&w=270&h=150',
      desc: 'The pear is any of several tree and shrub species of genus Pyrus, in the family Rosaceae.'
    }
  ];*/

  getProducts(category? : string, search? : string) : Product[] {
    /*if(category) {
      return this.products.filter((product : Product, index : number, array : Product[]) => { return product.categoryId == category})
    } else if(search) {
      let toSearch = search.toLocaleLowerCase();
      return this.products.filter((product : Product, index : number, array : Product[]) => { return product.title.toLocaleLowerCase().indexOf(toSearch) != -1 })
    }
*/
    return null;
  }

  getProduct(id : string) : Product {
   /* for(let i = 0; i < this.products.length; i++) {
      if(this.products[i]._id === id) {
        return this.products[i];
      }
    }
    throw new ProductNotFoundException(`Product ${id} not found!!!`);*/
    return null;
  }

  getVariations() : Observable<Variation[]> {
    return Rx.Observable.of(this.variations);
  }
}


