import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
import { Router } from '@angular/router';
import { TaskIntroduceService } from 'src/app/services/task-management/task-introduce.service';
import { CarWashService } from 'src/app/services/dummy-services/dummy.service';
// import * from '';

@Component({
  selector: 'app-sub-tasks',
  standalone: false,
  templateUrl: './sub-tasks.component.html',
  styleUrl: './sub-tasks.component.scss'
})
export class SubTasksComponent implements OnInit {
  tasks: Task[] = [];
  @Input() service!: CarWashService;
  imageArray: string[] | undefined;
  imagePath: string = '../../../../assets/images/car/car2.jpg'

  private serviceImages: string[] = [
    'assets/images/services/service1.jpg',
    'assets/images/services/service2.jpg',
    'assets/images/services/service3.jpg',
    'assets/images/services/service4.jpg',
    'assets/images/services/service5.jpg',
    'assets/images/services/service6.jpg',
    'assets/images/services/service7.jpg',
    'assets/images/services/service8.jpg',
  ];

  fallbackImage = 'assets/images/logo/vehicle-service-logo.jpg';

  constructor(
    private taskIntroduceService: TaskIntroduceService,
    private router: Router,
  ) {}

  ngOnInit(): void{
    this.taskIntroduceService.getData().subscribe((taskList: Task[]) => {
      this.tasks = taskList.map((t: Task) => ({
        ...t,
      })
    );
    }); 

    this.setImageArray();
  }

  getImage(index: number): string {
    return this.serviceImages[index % this.serviceImages.length];
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  public setImageArray(): void {
    this.imageArray?.push('https://images.pexels.com/photos/3954659/pexels-photo-3954659.jpeg?auto=compress&cs=tinysrgb&w=800');
  }

  public openTaskDetails(task: Task): void {
    console.log("task id :", task.id)
    this.router.navigate(['/dashboard', 'task-detail', task.id]);
  }

  onViewService() {
    // Handle service booking logic here
    console.log('Booking service:', this.service.name);
    alert(`Booking ${this.service.name} - $${this.service.price}`);
  }
  
}
