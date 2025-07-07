import { Component } from '@angular/core';

@Component({
  selector: 'app-front-page',
  standalone: false,
  templateUrl: './front-page.component.html',
  styleUrl: './front-page.component.scss',
})
export class FrontPageComponent {
  serviceEmail = 'namalvehicleservice@gmail.com';
  serviceAddress = 'address';
  serviceNumber = 'number';

  // these services needed to be loaded from database
  services = [
    {
      icon: 'fas fa-car',
      title: 'Full Car Wash',
      description:
        'Complete exterior and interior cleaning with premium products',
      price: '$29.99',
    },
    {
      icon: 'fas fa-tools',
      title: 'Oil Change',
      description: 'Quick and professional oil change service with quality oil',
      price: '$39.99',
    },
    {
      icon: 'fas fa-cog',
      title: 'Engine Service',
      description: 'Comprehensive engine maintenance and diagnostic services',
      price: '$89.99',
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Car Detailing',
      description: 'Premium detailing service for that showroom shine',
      price: '$149.99',
    },
    {
      icon: 'fas fa-wrench',
      title: 'Brake Service',
      description: 'Professional brake inspection and repair services',
      price: '$79.99',
    },
    {
      icon: 'fas fa-spray-can',
      title: 'Paint Protection',
      description: 'Advanced paint protection and ceramic coating',
      price: '$199.99',
    },
  ];

  features = [
    {
      icon: 'fas fa-users',
      title: 'Expert Technicians',
      description:
        'Our certified professionals have years of experience in car care',
    },
    {
      icon: 'fas fa-clock',
      title: 'Quick Service',
      description: 'Fast and efficient service without compromising on quality',
    },
    {
      icon: 'fas fa-star',
      title: 'Premium Quality',
      description:
        'We use only the best products and equipment for your vehicle',
    },
    {
      icon: 'fas fa-thumbs-up',
      title: 'Satisfaction Guaranteed',
      description: '100% satisfaction guarantee on all our services',
    },
  ];

  scrollToServices() {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
