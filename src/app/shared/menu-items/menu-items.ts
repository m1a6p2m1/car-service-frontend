import { Injectable } from '@angular/core';
import { authenticationEnum } from 'src/app/guards/auth.enum';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  {
    state: 'dashboard',
    name: 'Dashboard',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Home_Dashboard,
  },
  {
    state: 'privileges',
    childState: 'system-privileges',
    name: 'System Privileges',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Privileges,
  },
  {
    state: 'privileges',
    childState: 'privilege-groups',
    name: 'Privilege Groups',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Privilege_Groups,
  },
  {
    state: 'privileges',
    childState: 'system-test',
    name: 'Test Components',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Test,
  },

  {
    state: 'pages',
    childState: 'form-demo',
    name: 'Form Demo',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.FormDemo,
  },
  {
    state: 'registration',
    childState: 'employee',
    name: 'Employee Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Employee,
  },
  {
    state: 'registration',
    childState: 'customer',
    name: 'Customer Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Customer,
  },
  {
    state: 'registration',
    childState: 'supplier',
    name: 'Supplier Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Supplier,
  },
  {
    state: 'registration',
    childState: 'item',
    name: 'Item Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Item,
  },
  {
    state: 'task-management',
    childState: 'task-assign',
    name: 'Task Assign Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.Task_Assign,
  },
  {
    state: 'task-management',
    childState: 'all-task',
    name: 'All Task Form',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
    auth: authenticationEnum.All_Tasks,
  },

  {
    state: 'registration',
    childState: 'task',
    name: 'Task Assign Form CM',
    type: 'link',
    icon: 'av_timer',
    isVisible: false,
  },
  /*{
    state: 'button',
    type: 'link',
    name: 'Buttons',
    icon: 'crop_7_5',
    isVisible: false,
  },
  {
    state: 'grid',
    type: 'link',
    name: 'Grid List',
    icon: 'view_comfy',
    isVisible: false,
  },
  {
    state: 'lists',
    type: 'link',
    name: 'Lists',
    icon: 'view_list',
    isVisible: false,
  },
  {
    state: 'menu',
    type: 'link',
    name: 'Menu',
    icon: 'view_headline',
    isVisible: false,
  },
  { state: 'tabs', type: 'link', name: 'Tabs', icon: 'tab', isVisible: false },
  {
    state: 'stepper',
    type: 'link',
    name: 'Stepper',
    icon: 'web',
    isVisible: false,
  },
  {
    state: 'expansion',
    type: 'link',
    name: 'Expansion Panel',
    icon: 'vertical_align_center',
    isVisible: false,
  },
  {
    state: 'chips',
    type: 'link',
    name: 'Chips',
    icon: 'vignette',
    isVisible: false,
  },
  {
    state: 'toolbar',
    type: 'link',
    name: 'Toolbar',
    icon: 'voicemail',
    isVisible: false,
  },
  {
    state: 'progress-snipper',
    type: 'link',
    name: 'Progress snipper',
    icon: 'border_horizontal',
    isVisible: false,
  },
  {
    state: 'progress',
    type: 'link',
    name: 'Progress Bar',
    icon: 'blur_circular',
    isVisible: false,
  },
  {
    state: 'dialog',
    type: 'link',
    name: 'Dialog',
    icon: 'assignment_turned_in',
    isVisible: false,
  },
  {
    state: 'tooltip',
    type: 'link',
    name: 'Tooltip',
    icon: 'assistant',
    isVisible: false,
  },
  {
    state: 'snackbar',
    type: 'link',
    name: 'Snackbar',
    icon: 'adb',
    isVisible: false,
  },
  {
    state: 'slider',
    type: 'link',
    name: 'Slider',
    icon: 'developer_mode',
    isVisible: false,
  },
  {
    state: 'slide-toggle',
    type: 'link',
    name: 'Slide Toggle',
    icon: 'all_inclusive',
    isVisible: false,
  },*/
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
