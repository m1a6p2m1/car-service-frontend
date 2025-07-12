import { Injectable } from '@angular/core';

export interface CarWashService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
  popular?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CarWashServiceData {
  private services: CarWashService[] = [
    {
      id: 1,
      name: 'Basic Wash',
      description: 'Essential exterior cleaning with soap, rinse, and dry. Perfect for regular maintenance.',
      price: 15,
      duration: '30 minutes',
      image: 'https://images.pexels.com/photos/3954659/pexels-photo-3954659.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Exterior wash', 'Soap and rinse', 'Hand dry', 'Tire cleaning']
    },
    {
      id: 2,
      name: 'Premium Wash',
      description: 'Complete interior and exterior cleaning with premium products and attention to detail.',
      price: 35,
      duration: '1 hour',
      image: 'https://images.pexels.com/photos/5865434/pexels-photo-5865434.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Interior vacuuming', 'Dashboard cleaning', 'Premium exterior wash', 'Tire shine', 'Air freshener'],
      popular: true
    },
    {
      id: 3,
      name: 'Deluxe Detail',
      description: 'Professional detailing service including wax, polish, and comprehensive interior care.',
      price: 65,
      duration: '2 hours',
      image: 'https://images.pexels.com/photos/6872149/pexels-photo-6872149.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Full interior detail', 'Leather conditioning', 'Paint correction', 'Ceramic wax coating', 'Engine bay cleaning']
    },
    {
      id: 4,
      name: 'Express Clean',
      description: 'Quick and efficient wash for busy schedules. Get your car clean in no time.',
      price: 12,
      duration: '15 minutes',
      image: 'https://images.pexels.com/photos/5865282/pexels-photo-5865282.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Quick exterior wash', 'Fast dry', 'Basic tire cleaning']
    },
    {
      id: 5,
      name: 'Ultimate Package',
      description: 'The complete car care experience with every service included for the ultimate shine.',
      price: 95,
      duration: '3 hours',
      image: 'https://images.pexels.com/photos/13065690/pexels-photo-13065690.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Complete detailing', 'Paint protection', 'Interior restoration', 'Engine detailing', 'Headlight restoration', '6-month warranty']
    },
    {
      id: 6,
      name: 'Eco Wash',
      description: 'Environmentally friendly car wash using biodegradable products and water conservation.',
      price: 25,
      duration: '45 minutes',
      image: 'https://images.pexels.com/photos/6872139/pexels-photo-6872139.jpeg?auto=compress&cs=tinysrgb&w=800',
      features: ['Eco-friendly products', 'Water conservation', 'Exterior wash', 'Interior wipe down', 'Recyclable materials']
    }
  ];

  getServices(): CarWashService[] {
    return this.services;
  }

  getServiceById(id: number): CarWashService | undefined {
    return this.services.find(service => service.id === id);
  }
}