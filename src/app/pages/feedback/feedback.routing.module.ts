import { Routes } from "@angular/router";
import { CustomerFeedbackComponent } from "./customer-feedback/customer-feedback.component";

export const FeedbackRoutes: Routes = [
    {
        path: 'customer-feedback',
        component: CustomerFeedbackComponent
    },
];