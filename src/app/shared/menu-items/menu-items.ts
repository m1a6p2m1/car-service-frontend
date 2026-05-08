import { Injectable } from '@angular/core';
import { authenticationEnum } from 'src/app/guards/auth.enum';

// export interface Menu {
//   state?: string;
//   name: string;
//   type: string;
//   icon: string;
//   childState?: string;
//   isVisible?: boolean;
//   auth?: authenticationEnum;
//   children?: Menu[];
// }

export interface MenuBase {
  name: string;
  icon: string;
  type: 'link' | 'group';
}

export interface MenuLink extends MenuBase {
  type: 'link';
  state?: string;
  childState?: string;
  isVisible: boolean;
  auth?: authenticationEnum;
}

export interface MenuGroup extends MenuBase {
  type: 'group';
  auth?: authenticationEnum[],
  isVisible?: boolean;
  children: MenuLink[];
}

export type Menu = MenuLink | MenuGroup;


// const MENUITEMS = [
//   {
//     state: 'dashboard',
//     name: 'Dashboard',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Home_Dashboard,
//   },
//   {
//     state: 'privileges',
//     childState: 'system-privileges',
//     name: 'System Privileges',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Privileges,
//   },
//   {
//     state: 'privileges',
//     childState: 'privilege-groups',
//     name: 'Privilege Groups',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Privilege_Groups,
//   },
//   // {
//   //   state: 'privileges',
//   //   childState: 'system-test',
//   //   name: 'Test Components',
//   //   type: 'link',
//   //   icon: 'av_timer',
//   //   isVisible: false,
//   //   auth: authenticationEnum.Test,
//   // },

//   // {
//   //   state: 'pages',
//   //   childState: 'form-demo',
//   //   name: 'Form Demo',
//   //   type: 'link',
//   //   icon: 'av_timer',
//   //   isVisible: false,
//   //   auth: authenticationEnum.FormDemo,
//   // },
//   {
//     state: 'pages',
//     childState: 'user-profile',
//     name: 'User Profile',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.User_Profile,
//   },
  // {
  //   state: 'online-shopping',
  //   childState: 'product-list',
  //   name: 'Online Shopping',
  //   type: 'link',
  //   icon: 'av_timer',
  //   isVisible: false,
  //   auth: authenticationEnum.Home_Dashboard,
  // },


//   {
//     state: 'registration',
//     childState: 'employee',
//     name: 'Employee',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Employee,
//   },
//   {
//     state: 'registration',
//     childState: 'customer',
//     name: 'Customer',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Customer,
//   },
//   {
//     state: 'registration',
//     childState: 'supplier',
//     name: 'Supplier',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Supplier,
//   },
//   {
//     state: 'registration',
//     childState: 'item',
//     name: 'Item',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Item,
//   },
//   {
//     state: 'registration',
//     childState: 'online-item',
//     name: 'Online Products',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Home_Dashboard,
//   },
//   {
//     state: 'registration',
//     childState: 'task',
//     name: 'Task Assign Form CM',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//   },


  // {
  //   state: 'task-management',
  //   childState: 'task-introduce',
  //   name: 'Tasks',
  //   type: 'link',
  //   icon: 'av_timer',
  //   isVisible: false,
  //   auth: authenticationEnum.Task_Introduce,
  // },
  // {
  //   state: 'task-management',
  //   childState: 'task-assign',
  //   name: 'Task Assign',
  //   type: 'link',
  //   icon: 'av_timer',
  //   isVisible: false,
  //   auth: authenticationEnum.Task_Assign,
  // },
  // {
  //   state: 'task-management',
  //   childState: 'all-task',
  //   name: 'All Tasks',
  //   type: 'link',
  //   icon: 'av_timer',
  //   isVisible: false,
  //   auth: authenticationEnum.All_Tasks,
  // },

  

//   {
//     state: 'attendance',
//     childState: 'attendance-mark',
//     name: 'Attendance Mark',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Home_Dashboard,
//   },

//   // {
//   //   state: 'pages',
//   //   childState: 'employee-login',
//   //   name: 'Employee Login',
//   //   type: 'link',
//   //   icon: 'av_timer',
//   //   isVisible: false,
//   //   auth: authenticationEnum.Employee_Login,
//   // },

//   {
//     state: 'feedback',
//     childState: 'customer-feedback',
//     name: 'Customer Feedback',
//     type: 'link',
//     icon: 'av_timer',
//     isVisible: false,
//     auth: authenticationEnum.Home_Dashboard,
//   },
//   /*{
//     state: 'button',
//     type: 'link',
//     name: 'Buttons',
//     icon: 'crop_7_5',
//     isVisible: false,
//   },
//   {
//     state: 'grid',
//     type: 'link',
//     name: 'Grid List',
//     icon: 'view_comfy',
//     isVisible: false,
//   },
//   {
//     state: 'lists',
//     type: 'link',
//     name: 'Lists',
//     icon: 'view_list',
//     isVisible: false,
//   },
//   {
//     state: 'menu',
//     type: 'link',
//     name: 'Menu',
//     icon: 'view_headline',
//     isVisible: false,
//   },
//   { state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab', isVisible: false },
//   {
//     state: 'stepper',
//     type: 'link',
//     name: 'Stepper',
//     icon: 'web',
//     isVisible: false,
//   },
//   {
//     state: 'expansion',
//     type: 'link',
//     name: 'Expansion Panel',
//     icon: 'vertical_align_center',
//     isVisible: false,
//   },
//   {
//     state: 'chips',
//     type: 'link',
//     name: 'Chips',
//     icon: 'vignette',
//     isVisible: false,
//   },
//   {
//     state: 'toolbar',
//     type: 'link',
//     name: 'Toolbar',
//     icon: 'voicemail',
//     isVisible: false,
//   },
//   {
//     state: 'progress-snipper',
//     type: 'link',
//     name: 'Progress snipper',
//     icon: 'border_horizontal',
//     isVisible: false,
//   },
//   {
//     state: 'progress',
//     type: 'link',
//     name: 'Progress Bar',
//     icon: 'blur_circular',
//     isVisible: false,
//   },
//   {
//     state: 'dialog',
//     type: 'link',
//     name: 'Dialog',
//     icon: 'assignment_turned_in',
//     isVisible: false,
//   },
//   {
//     state: 'tooltip',
//     type: 'link',
//     name: 'Tooltip',
//     icon: 'assistant',
//     isVisible: false,
//   },
//   {
//     state: 'snackbar',
//     type: 'link',
//     name: 'Snackbar',
//     icon: 'adb',
//     isVisible: false,
//   },
//   {
//     state: 'slider',
//     type: 'link',
//     name: 'Slider',
//     icon: 'developer_mode',
//     isVisible: false,
//   },
//   {
//     state: 'slide-toggle',
//     type: 'link',
//     name: 'Slide Toggle',
//     icon: 'all_inclusive',
//     isVisible: false,
//   },*/
// ];



const MENUITEMS: Menu[] = [
  {
    name: 'Dashboard',
    icon: 'dashboard',
    type: 'group',
    isVisible: false,
    auth: [authenticationEnum.Home_Dashboard],
    children: [
      {
        state: 'dashboard',
        name: 'Dashboard',
        type: 'link',
        icon: 'dashboard',
        isVisible: false,
        auth: authenticationEnum.Home_Dashboard,
      }
    ]
  },
  {
  name: 'Privileges',
  icon: 'lock',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Privileges, authenticationEnum.Privilege_Groups],
  children: [
    {
      state: 'privileges',
      childState: 'system-privileges',
      name: 'System Privileges',
      type: 'link',
      icon: 'admin_panel_settings',
      isVisible: false,
      auth: authenticationEnum.Privileges,
    },
    {
      state: 'privileges',
      childState: 'privilege-groups',
      name: 'Privilege Groups',
      type: 'link',
      icon: 'group',
      isVisible: false,
      auth: authenticationEnum.Privilege_Groups,
    }
  ]
  },

  {
    name: 'Registration',
    icon: 'app_registration',
    type: 'group',
    isVisible: false,
    auth: [authenticationEnum.Employee, authenticationEnum.Customer, authenticationEnum.Vehicles, authenticationEnum.Supplier, authenticationEnum.Item, authenticationEnum.Online_Products, authenticationEnum.GRN],
    children: [
      {
        state: 'registration',
        childState: 'employee',
        name: 'Employee',
        type: 'link',
        icon: 'person',
        isVisible: false,
        auth: authenticationEnum.Employee,
      },
      {
        state: 'registration',
        childState: 'customer',
        name: 'Customer',
        type: 'link',
        icon: 'people',
        isVisible: false,
        auth: authenticationEnum.Customer,
      },
      {
        state: 'registration',
        childState: 'vehicles',
        name: 'Vehicles',
        type: 'link',
        icon: 'directions_car',
        isVisible: false,
        auth: authenticationEnum.Vehicles,
      },
      {
        state: 'registration',
        childState: 'supplier',
        name: 'Supplier',
        type: 'link',
        icon: 'store',
        isVisible: false,
        auth: authenticationEnum.Supplier,
      },
      {
        state: 'registration',
        childState: 'item',
        name: 'Item',
        type: 'link',
        icon: 'inventory',
        isVisible: false,
        auth: authenticationEnum.Item,
      },
      {
        state: 'registration',
        childState: 'online-item',
        name: 'Online Products',
        type: 'link',
        icon: 'shopping_cart',
        isVisible: false,
        auth: authenticationEnum.Online_Products,
      },
      {
        state: 'registration',
        childState: 'grn',
        name: 'GRN',
        type: 'link',
        icon: 'shopping_cart',
        isVisible: false,
        auth: authenticationEnum.GRN,
      }
    ]
  },
  {
  name: 'Task Hub',
  icon: 'task',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Task_Introduce, authenticationEnum.Task_Assign, authenticationEnum.All_Tasks, authenticationEnum.My_Tasks, authenticationEnum.Additional_Services],
  children: [
    {
      state: 'task-management',
      childState: 'task-introduce',
      name: 'Tasks',
      type: 'link',
      icon: 'playlist_add_check',
      isVisible: false,
      auth: authenticationEnum.Task_Introduce,
    },
    {
      state: 'task-management',
      childState: 'task-assign',
      name: 'Task Assign',
      type: 'link',
      icon: 'assignment_ind',
      isVisible: false,
      auth: authenticationEnum.Task_Assign,
    },
    {
      state: 'task-management',
      childState: 'all-task',
      name: 'All Tasks',
      type: 'link',
      icon: 'assignment',
      isVisible: false,
      auth: authenticationEnum.All_Tasks,
    },
    {
      state: 'task-management',
      childState: 'my-tasks',
      name: 'My Tasks',
      type: 'link',
      icon: 'assignment',
      isVisible: false,
      auth: authenticationEnum.My_Tasks,
    },
    {
      state: 'task-management',
      childState: 'additional-services',
      name: 'Additional Services',
      type: 'link',
      icon: 'playlist_add_check',
      isVisible: false,
      auth: authenticationEnum.Additional_Services,
    },
  ]
},
{
  name: 'Task Tracker',
  icon: 'event_available',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Home_Dashboard],
  children: [
    {
      state: 'task',
      childState: 'task-tracker',
      name: 'Task Tracker',
      type: 'link',
      icon: 'check_circle',
      isVisible: false,
      auth: authenticationEnum.Home_Dashboard,
    }
  ]
},
{
  name: 'Appointments',
  icon: 'event_available',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Appointment_List, authenticationEnum.All_Appointments],
  children: [
    {
      state: 'appointment',
      childState: 'appointment-list',
      name: 'Appointment List',
      type: 'link',
      icon: 'check_circle',
      isVisible: false,
      auth: authenticationEnum.Appointment_List,
    },
    {
      state: 'appointment',
      childState: 'all-appointments',
      name: 'All Appointments',
      type: 'link',
      icon: 'assignment',
      isVisible: false,
      auth: authenticationEnum.All_Appointments,
    }
  ]
},
{
  name: 'Attendance',
  icon: 'event_available',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Attendance],
  children: [
    {
      state: 'attendance',
      childState: 'attendance-mark',
      name: 'Attendance Mark',
      type: 'link',
      icon: 'check_circle',
      isVisible: false,
      auth: authenticationEnum.Attendance,
    }
  ]
},
{
  name: 'Reports',
  icon: 'event_available',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Employee_List_Report],
  children: [
    {
      state: 'reports',
      childState: 'employee-list',
      name: 'Employee List',
      type: 'link',
      icon: 'check_circle',
      isVisible: false,
      auth: authenticationEnum.Employee_List_Report,
    },
        {
      state: 'reports',
      childState: 'employee-stats',
      name: 'Employee Stats',
      type: 'link',
      icon: 'check_circle',
      isVisible: false,
      auth: authenticationEnum.Employee_List_Report,
    }
  ]
},
{
  name: 'Feedback',
  icon: 'feedback',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Customer_Feedback, authenticationEnum.All_Feedbacks],
  children: [
    {
      state: 'feedback',
      childState: 'customer-feedback',
      name: 'Feedback',
      type: 'link',
      icon: 'question_answer',
      isVisible: false,
      auth: authenticationEnum.Customer_Feedback,
    },
    {
      state: 'feedback',
      childState: 'all-feedbacks',
      name: 'All Feedbacks',
      type: 'link',
      icon: 'question_answer',
      isVisible: false,
      auth: authenticationEnum.All_Feedbacks,
    }
  ]
},
{
  name: 'Online Shopping',
  icon: 'shopping_cart',
  type: 'group',
  isVisible: false,
  auth: [authenticationEnum.Online_Shopping],
  children: [
    {
      state: 'online-shopping',
      childState: 'product-list',
      name: 'Products',
      type: 'link',
      icon: 'storefront',
      isVisible: false,
      auth: authenticationEnum.Online_Shopping,
    }
  ]
}
];


@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
