import { Routes } from "@angular/router";
import { CustomerFeedbackComponent } from "./customer-feedback/customer-feedback.component";
import { AllFeedbacksComponent } from "./all-feedbacks/all-feedbacks.component";

export const FeedbackRoutes: Routes = [
    {
        path: 'customer-feedback',
        component: CustomerFeedbackComponent
    },
    {
        path: 'all-feedbacks',
        component: AllFeedbacksComponent
    },
];