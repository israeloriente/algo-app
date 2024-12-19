import { AppRoutingModule } from "../app-routing.module";
import { Injectable } from '@angular/core';
import { Service } from "../class/services/Service";
import { Type } from "@angular/core";


/**
 * The 'status' parameter offers the ability to customize
 * the status value associated with a service when it is 
 * stored in the database, depending on the specific page 
 * on which the action is performed. This allows you to 
 * set a different status when the service is created 
 * compared to when it is edited.
 * */
export interface PageStatus {
    new: number,
    edit: number,
    isFixedPage?: boolean
}

@Injectable()
export class PageStatusService implements PageStatus {
    new: number;
    edit: number;
    args: any[] = [];
    isFixedPage: boolean = false;

    set status(status: PageStatus) {
        this.new = status.new;
        this.edit = status.edit;
        this.isFixedPage = status.isFixedPage;
    }
}

/**
 * The 'status' parameter offers the ability to customize
 * the status value associated with a service when it is 
 * stored in the database, depending on the specific page 
 * on which the action is performed. This allows you to 
 * set a different status when the service is created 
 * compared to when it is edited.
 * */
export interface ServicePage {
    components: Type<any>[];
    args?: any[];
    status?: PageStatus;
}

export interface ServiceOptions {
    title: string;
    color?: string;
    className?: string;
    settingName: string;
    iconName?: string;
    iconColor?: string;
    iconSrc?: string;
    pages?: ServicePage[];
}

export interface ServiceTypeComponent {
    title: string;
    color?: string;
    className: string;
    settingName: string;
    class: any;
    pages?: ServicePage[];
}

export type serviceStatus = "new" | "edit"

const serviceList: ServiceTypeComponent[] = [];

export async function setServiceOption(className: string) {
    className = className.toLowerCase();
    className = className.replace('/', '').trim();
    Service.SELECT = serviceList.find(e => e.className == className);
}

export function getServiceOptios(): ServiceTypeComponent[] {
    return serviceList;
}

export function ServiceComponent(options?: ServiceOptions): any {
    return function (target: Function) {
        const newService: ServiceTypeComponent = { ...options, class: target, className: target.name.toLowerCase() };
        updatePages(newService.pages);
        if (!serviceList.find(e => e.className == newService.className))
            serviceList.push(newService);
        AppRoutingModule.addRoutes(newService.className)
        return target;
    }
}

export function updatePages(pages?: ServicePage[]) {
    if (pages == undefined) pages = [];
    if (pages && pages.length > 0) {
        const indexEnd = pages.length - 1;
        pages.forEach((p, index) => {
            p.status = (p.status != undefined ? p.status : index == indexEnd ? { new: 0, edit: 0 } : { new: index + 1, edit: index + 1 })
        });
    }
}