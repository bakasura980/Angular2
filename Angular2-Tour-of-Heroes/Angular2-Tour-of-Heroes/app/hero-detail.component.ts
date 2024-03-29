﻿import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core'
import { Hero } from './hero';
import { ActivatedRoute, Router } from '@angular/router'; 
import { HeroService } from './hero.service';

@Component({
    selector: 'my-hero-detail',
    templateUrl: `app/hero-detail.component.html`,
    styleUrls: [`app/hero-detail.component.html`]
})


export class HeroDetailComponent implements OnInit, OnDestroy {
    constructor(private heroService: HeroService, private route: ActivatedRoute, private router: Router) { }

    @Input() hero: Hero;
    @Output() close = new EventEmitter();
    error: any;
    navigated: boolean = false;

    sub: any;

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (params['id'] !== undefined) {
                let id = +params['id'];
                this.navigated = true;
                this.heroService.getHero(id).then(hero => this.hero = hero);

            } else {
                this.navigated = false;
                this.hero = new Hero();
            }
        })
    }

    save() {
        this.heroService
            .save(this.hero)
            .then(hero => {
                this.hero = hero;
                this.goBack(hero);
            })
            .catch(error => this.error = error);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    goBack(savedHero: Hero = null) {
        this.close.emit(savedHero);
        if (this.navigated) {
            let link = ['/'];
            this.router.navigate(link);
        }
    }
}