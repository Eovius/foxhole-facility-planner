Vue.component('app-game-sidebar', {
    data: function() {
        return {
            currentMenu: null,
            currentMenuData: null,
            hoverData: null,
            menuList: [
                {
                    key: 'statistics',
                    name: 'Statistics',
                    icon: 'fa-bar-chart'
                },
                {
                    key: 'save-load',
                    name: 'Save/Load',
                    icon: 'fa-save'
                },
                {
                    key: 'settings',
                    name: 'Settings',
                    icon: 'fa-gear'
                },
                {
                    key: 'about',
                    name: 'About',
                    icon: 'fa-info-circle'
                }
            ]
        };
    },
    mounted: function () {
        game.sidebarMenuComponent = this;
        this.changeMenu(null);
    },
    methods: {
        changeMenu: function(newMenu, menuData) {
            if (typeof newMenu === 'string' || newMenu instanceof String) {
                for (let i=0; i<this.menuList.length; i++) {
                    let menu = this.menuList[i];
                    if (menu.key === newMenu) {
                        newMenu = menu;
                        break;
                    }
                }
            }

            this.bmc();
            if (newMenu) {
                this.currentMenu = newMenu;
            } else {
                this.currentMenu = null;
            }
            this.currentMenuData = menuData;

            if (game.getSelectedEntities().length && (!this.currentMenu || this.currentMenu.key !== 'building-selected')) {
                game.deselectEntities();
            }
        },
        selectFaction: function(faction) {
            this.bmc();
            game.setFaction(game.settings.selectedFaction !== faction ? faction : null);
        },
        showHoverMenu: function(data) {
            this.hoverData = data;
        }
    },
    template: html`
    <div id="sidebar">
        <div id="sidebar-header">
            <button class="colonial-button" :class="{ selected: game.settings.selectedFaction == 'c' }" title="Colonial Faction" @click="selectFaction('c')" @mouseenter="bme()"></button>
            <img class="sidebar-logo" src="/assets/logo_transparent.webp">
            <button class="warden-button" :class="{ selected: game.settings.selectedFaction == 'w' }" title="Warden Faction" @click="selectFaction('w')" @mouseenter="bme()"></button>
        </div>
        <div id="sidebar-body" :class="currentMenu ? currentMenu.key + '-page' : 'construction-page'">
            <div v-if="!currentMenu" class="menu-body">
                <app-menu-construction-list></app-menu-construction-list>
            </div>
            <div v-if="currentMenu" class="menu-body">
                <div class="menu-page-title"><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</div>
                <button type="button" class="title-button return-button" v-on:click="changeMenu(null)" title="Back" @mouseenter="bme()">
                    <div class="inner-button"><i class="fa fa-arrow-left"></i></div>
                </button>
                <div class="menu-page">
                    <component v-bind:is="'app-menu-' + currentMenu.key" :menuData="currentMenuData"></component>
                </div>
            </div>
            <div class="menu-footer-buttons">
                <button v-if="!currentMenu" type="button" class="app-btn app-btn-primary" v-on:click="changeMenu('save-load')" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Save/Load
                </button>
                <button v-if="currentMenu"  type="button" class="app-btn app-btn-primary" v-on:click="changeMenu(null)" @mouseenter="bme()">
                    <i class="fa fa-arrow-left"></i> Return
                </button>
            </div>
        </div>
        <div id="sidebar-footer">
            <a class="float-left github-button" href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank" @click="bmc()" @mouseenter="bme()">
                <i class="fa fa-github"></i>
            </a>
            <a class="float-left discord-button" href="https://discord.gg/SnyEDQyAVr" target="_blank" @click="bmc()" @mouseenter="bme()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            </a>
            <button v-on:click="event.preventDefault(); changeMenu('settings')" class="float-right" @mouseenter="bme()">
                <i class="fa fa-gear"></i>
            </button>
            <button v-on:click="event.preventDefault(); changeMenu('about')" class="float-right" @mouseenter="bme()">
                <i class="fa fa-question-circle"></i>
            </button>
        </div>
        <div id="hover-building-info" v-if="hoverData">
            <div class="building-info-name">
                <img v-bind:src="'/assets/' + (hoverData.icon ?? 'default_icon.webp')" />
                <h4>{{hoverData.parentName ? hoverData.parentName : hoverData.name}}</h4>
            </div>
            <div v-if="hoverData.parentName" class="building-info-upgrade">
                <i class="fa fa-check-circle" aria-hidden="true"></i> {{hoverData.upgradeName}} Upgrade
            </div>
            <div class="building-info-body">
                <p class="building-info-description">{{hoverData.description}}</p>
                <p class="building-tech-description" v-if="hoverData.techId">
                    <span>Requires Tech<template v-if="window.objectData.tech[hoverData.techId]">:</template></span> {{window.objectData.tech[hoverData.techId]?.name}}
                </p>
                <div class="building-info-production" v-if="hoverData.production && hoverData.production.length && hoverData.production.hasOutput">
                    <template v-for="(recipe, index) in hoverData.production">
                        <app-game-recipe v-if="!recipe.faction || !game.settings.selectedFaction || recipe.faction == game.settings.selectedFaction" :building="hoverData" :recipe="recipe"></app-game-recipe>
                    </template>
                </div>
                <div class="building-cost">
                    <app-game-resource-icon v-for="(value, key) in (hoverData.upgradeCost ?? hoverData.cost)" :resource="key" :amount="value"/>
                </div>
                <div class="power-cost" v-if="hoverData.power < 0">
                    <i class="fa fa-bolt"></i> {{hoverData.power}} MW
                </div>
                <div class="power-produced" v-else-if="hoverData.power > 0">
                    <i class="fa fa-bolt"></i> {{hoverData.production && hoverData.production.power ? hoverData.production.power : hoverData.power}} MW
                </div>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-building-selected', {
    props: ['menuData'],
    data: function() {
        return {
            entity: {
                type: null,
                subtype: null,
                x: 0,
                y: 0,
                rotation: 0,
                rotationDegrees: 0,
                selectedProduction: null,
                productionScale: null,
                following: false,
                label: null,
                style: null
            },
            productionData: null,
            hoverUpgradeName: null,
            lockState: 0
        };
    },
    mounted: function() {
        game.buildingSelectedMenuComponent = this;
        this.refresh();
        this.focusText();
    },
    methods: {
        refresh: function(noForce) {
            this.lockState = game.getSelectedLockState();
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                if (noForce && this.entity && this.entity.x === selectedEntity.x && this.entity.y === selectedEntity.y && this.entity.rotation === selectedEntity.rotation) {
                    return;
                }
                this.entity = {
                    type: selectedEntity.type,
                    subtype: selectedEntity.subtype,
                    x: selectedEntity.x,
                    y: selectedEntity.y,
                    rotation: selectedEntity.rotation,
                    rotationDegrees: Math.rad2deg(selectedEntity.rotation),
                    selectedProduction: selectedEntity.selectedProduction,
                    productionScale: selectedEntity.productionScale,
                    building: selectedEntity.building,
                    following: selectedEntity.following,
                    label: selectedEntity.label?.text,
                    style: Object.assign({}, selectedEntity.labelStyle ?? selectedEntity.shapeStyle),
                    userThrottle: selectedEntity.userThrottle,
                    trackVelocity: selectedEntity.trackVelocity
                };
                this.updateProduction();
                if (this.entity.type === 'shape') {
                    this.entity.style.alpha = this.entity.style.alpha * 100;
                    this.entity.style.fillColor = `#${this.entity.style.fillColor.toString(16)}`;
                    this.entity.style.lineColor = `#${this.entity.style.lineColor.toString(16)}`;
                }
            } else if (this.entity || this.productionData) {
                this.entity = null;
                this.productionData = null;
            }
            this.$forceUpdate();
        },
        updateEntity: function(removeConnections) {
            if (this.entity) {
                this.entity.x = this.entity.x || 0;
                this.entity.y = this.entity.y || 0;
                this.entity.rotationDegrees = this.entity.rotationDegrees || 0;
                let selectedEntity = game.getSelectedEntity();
                if (selectedEntity) {
                    if (!selectedEntity.building?.vehicle) {
                        selectedEntity.x = this.entity.x;
                        selectedEntity.y = this.entity.y;
                        selectedEntity.rotation = Math.deg2rad(this.entity.rotationDegrees);
                    }
                    this.entity.rotation = selectedEntity.rotation;
                    if (selectedEntity.type === 'building') {
                        if (removeConnections) {
                            selectedEntity.removeConnections();
                        }
                        selectedEntity.setProductionId(this.entity.selectedProduction);
                        if (typeof this.entity.userThrottle === 'number') {
                            selectedEntity.userThrottle = this.entity.userThrottle;
                        }
                    }
                    if (selectedEntity.type === 'text') {
                        selectedEntity.setLabel(this.entity.label);
                        this.entity.style.fontSize = this.entity.style.fontSize > 500 ? 500 : this.entity.style.fontSize < 12 ? 12 : this.entity.style.fontSize;
                        selectedEntity.setLabelStyle(this.entity.style);
                    } else if (selectedEntity.type === 'shape') {
                        let style = Object.assign({}, this.entity.style);
                        style.alpha = style.alpha / 100;
                        style.alpha = style.alpha > 1 ? 1 : style.alpha < 0 ? 0 : style.alpha;
                        style.fillColor = parseInt(style.fillColor.slice(1), 16);
                        style.lineWidth = style.lineWidth > 64 ? 64 : style.lineWidth < 6 ? 6 : style.lineWidth;
                        style.lineColor = parseInt(style.lineColor.slice(1), 16);
                        selectedEntity.setShapeStyle(style);
                    }

                    if (game.statisticsMenuComponent) {
                        game.statisticsMenuComponent.refresh();
                    }
                    this.$forceUpdate();
                } else {
                    this.refresh();
                }
            }
        },
        /*
        addRail: function() {
            this.bmc();
            if (this.entity) {
                this.entity.addPoint(100, 0);
            }
        },
        */
        changeProduction: function(id) {
            this.bmc();
            if (this.entity) {
                this.entity.selectedProduction = this.entity.selectedProduction !== id ? id : null;
                this.entity.productionScale = null;
                this.updateEntity();
            }
        },
        updateProduction: function() {
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                if (typeof this.entity.selectedProduction !== 'number') {
                    this.productionData = null;
                    selectedEntity.productionScale = null;
                } else {
                    for (let i = 0; i < this.entity.building.production.length; i++) {
                        let production = this.entity.building.production[i];
                        if (production.id === this.entity.selectedProduction) {
                            this.productionData = production;
                            this.productionData.max = Math.floor((production.time > 3600 ? 86400 : 3600) / production.time);
                            if (this.productionData.max > 0) {
                                this.entity.productionScale = this.entity.productionScale ?? this.productionData.max;
                                if (selectedEntity.productionScale !== this.entity.productionScale) {
                                    selectedEntity.productionScale = this.entity.productionScale;
                                    game.statisticsMenuComponent?.refresh();
                                }
                            }
                            break;
                        }
                    }
                }
            }
        },
        changeUpgrade: function(upgrade) {
            this.bmc();
            game.upgradeSelected(upgrade);
        },
        cloneBuildings: function() {
            this.bmc();
            game.cloneSelected();
        },
        lockBuildings: function() {
            this.bmc();
            game.lockSelected();
            this.refresh();
        },
        destroyBuildings: function() {
            this.bmc();
            game.deselectEntities(true);
        },
        showUpgradeHover: function(key, upgrade) {
            this.hoverUpgradeName = upgrade ? upgrade.name : null;
            let buildingUpgrade = null;
            if (key && upgrade && this.entity) {
                this.bme();
                const building = this.entity.building;
                if (building) {
                    buildingUpgrade = window.objectData.buildings[(building.parentKey ? building.parentKey : building.key) + '_' + key];
                }
            }
            game.sidebarMenuComponent.showHoverMenu(buildingUpgrade);
        },
        focusText: function() {
            if (this.entity && this.entity.type === 'text') {
                this.$nextTick(() => this.$refs.label?.focus());
            }
        },
        toggleFollow: function() {
            const selectedEntity = game.getSelectedEntity();
            game.followEntity(!selectedEntity.following && selectedEntity ? selectedEntity : null);
        },
        setColor: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                selectedEntity.sprite.rope.tint = parseInt(this.entity.color.slice(1), 16);
            }
        },
        detachConnections: function(socketId) {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.sockets) {
                selectedEntity.removeConnections(socketId);
            }
        },
        flipTrain: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.isTrain) {
                selectedEntity.trackVelocity = 0;
                selectedEntity.trackDirection *= -1;
                if (selectedEntity.sockets) {
                    let entityConnections = {};
                    for (let i = 0; i < selectedEntity.sockets.children.length; i++) {
                        const entitySocket = selectedEntity.sockets.children[i];
                        if (entitySocket.socketData.id === 0 || entitySocket.socketData.id === 1) {
                            entityConnections[entitySocket.socketData.id] = Object.assign({}, entitySocket.connections);
                        }
                    }
                    for (let i = 0; i < selectedEntity.sockets.children.length; i++) {
                        const entitySocket = selectedEntity.sockets.children[i];
                        if (entitySocket.socketData.id === 0 || entitySocket.socketData.id === 1) {
                            const socketConnections = entityConnections[entitySocket.socketData.id ? 0 : 1];
                            for (const [connectedEntityId, connectedSocketId] of Object.entries(socketConnections)) {
                                const connectedEntity = game.getEntityById(connectedEntityId);
                                if (connectedEntity.sockets) {
                                    for (let j = 0; j < connectedEntity.sockets.children.length; j++) {
                                        const connectedSocket = connectedEntity.sockets.children[j];
                                        if (connectedSocket.socketData.id === connectedSocketId) {
                                            connectedSocket.setConnection(selectedEntity.id, entitySocket);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    template: html`
    <div class="text-left">
        <button type="button" class="title-button trash-button" v-on:click="destroyBuildings()" title="Delete" @mouseenter="bme()">
            <div class="inner-button"><i class="fa fa-trash"></i></div>
        </button>
        <button type="button" class="title-button clone-button" v-on:click="cloneBuildings()" title="Clone" @mouseenter="bme()">
            <div class="inner-button"><i class="fa fa-clone"></i></div>
        </button>
        <button type="button" class="title-button lock-button" v-on:click="lockBuildings()" title="Lock" @mouseenter="bme()">
            <div class="inner-button">
                <span v-if="lockState === 1" class="locked"><i class="fa fa-lock"></i></span>
                <span v-else-if="lockState === 0" class="partially-locked"><i class="fa fa-unlock"></i></span>
                <span v-else><i class="fa fa-unlock"></i></span>
            </div>
        </button>
        <template v-if="game.getSelectedEntities().length === 1">
            <div class="settings-option-wrapper">
                <div v-if="entity.building" class="settings-title">
                    {{entity.building.parentName ? entity.building.parentName : entity.building.name}}
                </div>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Position X:
                    <input class="app-input" type="number" v-model.number="entity.x" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                </label>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Position Y:
                    <input class="app-input" type="number" v-model.number="entity.y" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                </label>
                <label class="app-input-label">
                    <i class="fa fa-repeat" aria-hidden="true"></i> Rotation:
                    <input class="app-input" type="number" v-model.number="entity.rotationDegrees" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                </label>
                <label v-if="game.settings.enableExperimental && entity.subtype === 'power_line'" class="app-input-label">
                    <i class="fa fa-paint-brush" aria-hidden="true"></i> Color:
                    <input type="color" v-model="entity.color" style="padding: 1px;" @input="setColor()">
                </label>
                <div v-if="entity.building?.vehicle" class="settings-option-row">
                    <i class="fa fa-chain-broken" aria-hidden="true"></i> Detach
                    <button class="btn-small w-auto m-0 px-2" type="button" @click="detachConnections(1)">Back</button>&nbsp;
                    <button class="btn-small w-auto m-0 mr-1 px-2" type="button" @click="detachConnections(0)">Front</button>&nbsp;
                    <button class="btn-small w-auto m-0 mr-1 px-2" type="button" @click="detachConnections()">All</button>&nbsp;
                </div>
                <div v-if="entity.building?.vehicle" class="settings-option-row">
                    <i class="fa fa-exchange" aria-hidden="true"></i> Flip Train
                    <button class="btn-small m-0" type="button" @click="flipTrain()"><i class="fa fa-exchange" aria-hidden="true"></i></button>
                </div>
            </div>
            <div v-if="entity.building?.vehicle?.engine" class="settings-option-wrapper">
                <div class="settings-title">
                    Train Controls
                    <button class="btn-small m-0" :class="{ 'btn-active': entity.following }" style="font-size: 0.9em; position: absolute; right: 6px;" title="Follow" @click="toggleFollow()"><i class="fa fa-video-camera" aria-hidden="true"></i></button>
                </div>
                <label class="app-input-label">
                    <i class="fa fa-train" aria-hidden="true"></i> Speed
                    <input class="app-input" type="number" v-model.number="entity.trackVelocity" disabled>
                </label>
                <label class="app-input-label">
                    <i class="fa fa-train" aria-hidden="true"></i> Throttle ({{Math.round(entity.userThrottle*100)}}%)
                    <input type="range" class="slider w-50" v-model.number="entity.userThrottle" min="-1" max="1" step="0.1" @input="updateEntity()">
                </label>
            </div>
            <div v-if="entity.type === 'text'" class="settings-option-wrapper">
                <div class="settings-title">Text Options</div>
                <!--<i class="fa fa-text-height" aria-hidden="true"></i>-->
                <div class="settings-option d-flex justify-content-center">
                    <button class="btn-small" :class="{ 'btn-active': entity.style.fontWeight === 'bold' }" type="button" @click="entity.style.fontWeight = entity.style.fontWeight === 'bold' ? 'normal' : 'bold'; updateEntity();"><i class="fa fa-bold" aria-hidden="true"></i></button>
                    <button class="btn-small" :class="{ 'btn-active': entity.style.fontStyle === 'italic' }" type="button" @click="entity.style.fontStyle = entity.style.fontStyle === 'italic' ? 'normal' : 'italic'; updateEntity();"><i class="fa fa-italic" aria-hidden="true"></i></button>
                    <button class="btn-small ml-auto" :class="{ 'btn-active': entity.style.align === 'left' }" type="button" @click="entity.style.align = 'left'; updateEntity();"><i class="fa fa-align-left" aria-hidden="true"></i></button>
                    <button class="btn-small" :class="{ 'btn-active': entity.style.align === 'center' }" type="button" @click="entity.style.align = 'center'; updateEntity();"><i class="fa fa-align-center" aria-hidden="true"></i></button>
                    <button class="btn-small mr-auto" :class="{ 'btn-active': entity.style.align === 'right' }" type="button" @click="entity.style.align = 'right'; updateEntity();"><i class="fa fa-align-right" aria-hidden="true"></i></button>
                    <input class="btn-small small-number-input" type="number" v-model.number="entity.style.fontSize" style="width: 40px;" @input="updateEntity()" min="12" max="500">
                    <input class="btn-small" type="color" v-model="entity.style.fill" style="padding: 1px;" @input="updateEntity()">
                </div>
                <textarea ref="label" v-model.trim="entity.label" @input="updateEntity()" maxlength="500" placeholder="Text Required"></textarea>
            </div>
            <div v-else-if="entity.type === 'shape'" class="settings-option-wrapper">
                <div class="settings-title">Shape Options</div>
                <div class="settings-option d-flex justify-content-center">
                    <input class="btn-small small-number-input" type="number" v-model.number="entity.style.alpha" style="width: 40px;" @input="updateEntity()" min="1" max="100">

                    <template v-if="entity.subtype === 'line'">
                        <button class="btn-small" :class="{ 'btn-active': entity.style.frontArrow }" type="button" @click="entity.style.frontArrow = !entity.style.frontArrow; updateEntity();"><i class="fa fa-caret-left" aria-hidden="true"></i></button>
                        <button class="btn-small" :class="{ 'btn-active': entity.style.backArrow }" type="button" @click="entity.style.backArrow = !entity.style.backArrow; updateEntity();"><i class="fa fa-caret-right" aria-hidden="true"></i></button>
                    </template>
                    
                    <!--<button v-if="entity.subtype !== 'line'" class="btn-small" :class="{ 'btn-active': entity.style.fill }" type="button" @click="entity.style.fill = !entity.style.fill; updateEntity();"><i class="fa fa-square" aria-hidden="true"></i></button>-->
                    <input class="btn-small" type="color" v-model="entity.style.fillColor" style="padding: 1px;" @input="updateEntity()">

                    <button v-if="entity.subtype !== 'line'" class="btn-small" :class="{ 'btn-active': entity.style.border }" type="button" @click="entity.style.border = !entity.style.border; updateEntity();"><i class="fa fa-square-o" aria-hidden="true"></i></button>
                    <input class="btn-small small-number-input" type="number" v-model.number="entity.style.lineWidth" style="width: 40px;" @input="updateEntity()" min="6" max="64" :disabled="entity.subtype !== 'line' && !entity.style.border">
                    <!--<input v-if="entity.subtype !== 'line'" class="btn-small" type="color" v-model="entity.style.lineColor" style="padding: 1px;" @input="updateEntity()">-->
                </div>
            </div>
        </template>
        <div v-else class="settings-option-wrapper text-center">
            <div class="settings-title">
                ({{game.getSelectedEntities().length}}) Buildings Selected
            </div>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" v-on:click="game.downloadSave(true)" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Export Selection
                </button>
            </div>
        </div>
        <template v-if="game.getSelectedEntities().length === 1">
            <div v-if="entity.building && entity.building.upgrades" class="settings-option-wrapper upgrade-list">
                <div class="settings-title">{{hoverUpgradeName ?? (entity.building.upgradeName ?? 'No Upgrade Selected')}}</div>
                <button class="upgrade-button" v-for="(upgrade, key) in entity.building.upgrades" :class="{'selected-upgrade': entity.building.parentKey && entity.building.key === entity.building.parentKey + '_' + key}"
                    @mouseenter="showUpgradeHover(key, upgrade)" @mouseleave="showUpgradeHover()" @click="changeUpgrade(key)">
                    <div class="resource-icon" :title="upgrade.name" :style="{backgroundImage:'url(/assets/' + (upgrade.icon ?? entity.building.icon) + ')'}"></div>
                </button>
            </div>
            <div v-if="productionData" class="settings-option-wrapper">
                <div class="settings-title">
                    <button type="button" class="title-button return-button" v-on:click="changeProduction(null)" title="Back" @mouseenter="bme()" style="padding: 1px 2px;">
                        <div class="btn-small m-1"><i class="fa fa-arrow-left"></i></div>
                    </button>
                    Production Stats
                </div>
                <div class="production-stats">
                    <div class="select-production m-2" v-if="!productionData.faction || !game.settings.selectedFaction || productionData.faction == game.settings.selectedFaction">
                        <app-game-recipe :building="entity.building" :recipe="productionData"></app-game-recipe>
                        <h6 class="production-requirements">
                            <template v-if="productionData.power || entity.building.power">
                                <span title="Power"><i class="fa fa-bolt"></i> {{productionData.power || entity.building.power}} MW</span>
                                &nbsp;&nbsp;&nbsp;
                            </template>
                            <span title="Time"><i class="fa fa-clock-o"></i> {{productionData.time}}s</span>
                        </h6>
                    </div>
                    <template v-if="productionData">
                        <template v-if="entity.building.productionScaling !== false && productionData.max > 0">
                            <div class="text-center p-2 mb-1">
                                <i class="fa fa-arrow-circle-down" aria-hidden="true"></i> Limiter: 
                                <span v-if="productionData.time <= 3600">x{{entity.productionScale}} cycles/hr</span>
                                <span v-else>x{{entity.productionScale}} cycles/day</span>
                                <input type="range" class="slider w-100" v-model.number="entity.productionScale" min="0" :max="productionData.max" step="1" @input="updateProduction()">
                            </div>
                        </template>
                        <template v-if="entity.productionScale > 0">
                            <div class="production-stats-resources">
                                <div v-if="productionData.input && Object.keys(productionData.input).length" class="mb-3">
                                    <h5><i class="fa fa-sign-in"></i> Building Input<span v-if="productionData.time <= 3600">/hr</span><span v-else>/day</span></h5>
                                    <div class="statistics-panel-fac-input">
                                        <app-game-resource-icon v-for="(value, key) in productionData.input" :resource="key" :amount="entity.productionScale * value"/>
                                    </div>
                                </div>
                                <div v-if="productionData.output && Object.keys(productionData.output).length">
                                    <h5><i class="fa fa-sign-out"></i> Building Output<span v-if="productionData.time <= 3600">/hr</span><span v-else>/day</span></h5>
                                    <div class="statistics-panel-fac-output">
                                        <app-game-resource-icon v-for="(value, key) in productionData.output" :resource="key" :amount="entity.productionScale * value"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <div v-else-if="entity.building && entity.building.production && entity.building.production.length" class="settings-option-wrapper">
                <div class="settings-title">Select Production</div>
                <div class="production-list">
                    <template v-for="production in entity.building.production">
                        <div class="select-production" v-if="!production.faction || !game.settings.selectedFaction || production.faction == game.settings.selectedFaction" :class="{'selected-production': entity.selectedProduction === production.id}" @click="changeProduction(production.id)">
                            <app-game-recipe :building="entity.building" :recipe="production"></app-game-recipe>
                            <h6 class="production-requirements">
                                <template v-if="production.power || entity.building.power">
                                    <span title="Power"><i class="fa fa-bolt"></i> {{production.power || entity.building.power}} MW</span>
                                    &nbsp;&nbsp;&nbsp;
                                </template>
                                <span title="Time"><i class="fa fa-clock-o"></i> {{production.time}}s</span>
                            </h6>
                            <div class="production-enabled"><i class="fa fa-power-off " aria-hidden="true"></i></div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
    `
});

Vue.component('app-menu-construction-list', {
    props: ['menuData'],
    data: function() {
        return {
            buildings: window.objectData.buildings_list,
            modeOptions: null
        };
    },
    mounted: function() {
        game.constructionMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function() {
            const modeSettings = game.settings.styles[game.constructionMode.key];
            if (game.constructionMode.key !== 'select' && modeSettings) {
                this.modeOptions = Object.assign({}, modeSettings);
                if (game.constructionMode.key !== 'label') {
                    this.modeOptions.alpha = this.modeOptions.alpha * 100;
                    if (typeof this.modeOptions.fillColor === 'number') {
                        this.modeOptions.fillColor = `#${this.modeOptions.fillColor.toString(16)}`;
                    }
                    if (typeof this.modeOptions.lineColor === 'number') {
                        this.modeOptions.lineColor = `#${this.modeOptions.lineColor.toString(16)}`;
                    }
                }
            } else {
                this.modeOptions = null;
            }
            this.$forceUpdate();
        },
        incrementTier: function() {
            this.bmc();
            game.settings.selectedTier++;
            if (game.settings.selectedTier >= 4) {
                game.settings.selectedTier = 1;
            }
            game.updateSettings();
        },
        setConstructionMode: function(mode) {
            this.bmc();
            game.setConstructionMode(mode);
        },
        /*
        toggleConstructionLayer: function(layer) {
            this.bmc();
            game.toggleConstructionLayer(layer);
        },
        */
        updateMenuOptions: function() {
            if (game.constructionMode.key !== 'select') {
                const modeSettings = game.settings.styles[game.constructionMode.key];
                if (modeSettings) {
                    let optionsCopy;
                    if (game.constructionMode.key === 'label') {
                        this.modeOptions.fontSize = this.modeOptions.fontSize > 500 ? 500 : this.modeOptions.fontSize < 12 ? 12 : this.modeOptions.fontSize;
                    } else {
                        optionsCopy = Object.assign({}, this.modeOptions);
                        optionsCopy.alpha = optionsCopy.alpha / 100;
                        optionsCopy.alpha = optionsCopy.alpha > 1 ? 1 : optionsCopy.alpha < 0 ? 0 : optionsCopy.alpha;
                        if (typeof optionsCopy.fillColor === 'string') {
                            optionsCopy.fillColor = parseInt(optionsCopy.fillColor.slice(1), 16);
                        }
                        optionsCopy.lineWidth = optionsCopy.lineWidth > 64 ? 64 : optionsCopy.lineWidth < 6 ? 6 : optionsCopy.lineWidth;
                        if (typeof optionsCopy.lineColor === 'string') {
                            optionsCopy.lineColor = parseInt(optionsCopy.lineColor.slice(1), 16);
                        }
                    }
                    game.settings.styles[game.constructionMode.key] = optionsCopy ?? this.modeOptions;
                    game.updateSettings();
                    this.refresh();
                }
            }
        },
        resetModeOptions: function() {
            if (game.constructionMode.key !== 'select') {
                game.settings.styles[game.constructionMode.key] = Object.assign({}, game.defaultSettings.styles[game.constructionMode.key]);
                game.updateSettings();
                this.refresh();
            }
        }
    },
    template: html`
    <div id="construction-page">
        <div class="construction-modes-wrapper">
            <div class="construction-mode-switcher row">
                <button v-for="mode in game.constructionModes" class="construction-mode-button col" :class="[{ 'mode-selected': game.constructionMode.key === mode.key }, mode.key + '-mode-button']" :title="mode.title" @mouseenter="bme()" @click="setConstructionMode(mode)">
                    <i v-if="mode.icon" :class="'fa ' + mode.icon" aria-hidden="true"></i>
                    <span v-else-if="mode.text">{{mode.text}}</span>
                </button>
            </div>
            <div class="construction-mode-options row d-flex justify-content-center position-relative">
                <template v-if="modeOptions && game.constructionMode.key === 'label'">
                    <div class="btn-small col" title="Bold" :class="{ 'btn-active': modeOptions.fontWeight === 'bold' }" @click="modeOptions.fontWeight = modeOptions.fontWeight === 'bold' ? 'normal' : 'bold'; updateMenuOptions()">
                        <i class="fa fa-bold" aria-hidden="true"></i>
                        <label>bold</label>
                    </div>
                    <div class="btn-small col" title="Italic" :class="{ 'btn-active': modeOptions.fontStyle === 'italic' }" @click="modeOptions.fontStyle = modeOptions.fontStyle === 'italic' ? 'normal' : 'italic'; updateMenuOptions()">
                        <i class="fa fa-italic" aria-hidden="true"></i>
                        <label>italic</label>
                    </div>
                    <div class="btn-small col" title="Align Left" :class="{ 'btn-active': modeOptions.align === 'left' }" @click="modeOptions.align = 'left'; updateMenuOptions()">
                        <i class="fa fa-align-left" aria-hidden="true"></i>
                        <label>align</label>
                    </div>
                    <div class="btn-small col" title="Align Middle" :class="{ 'btn-active': modeOptions.align === 'center' }" @click="modeOptions.align = 'center'; updateMenuOptions()">
                        <i class="fa fa-align-center" aria-hidden="true"></i>
                        <label>align</label>
                    </div>
                    <div class="btn-small col" title="Align Right" :class="{ 'btn-active': modeOptions.align === 'right' }" @click="modeOptions.align = 'right'; updateMenuOptions()">
                        <i class="fa fa-align-right" aria-hidden="true"></i>
                        <label>align</label>
                    </div>
                    <div class="btn-small col">
                        <input class="btn-small small-number-input" title="Font Size" type="number" v-model.number="modeOptions.fontSize" min="12" max="500" @input="updateMenuOptions()">
                        <label>px</label>
                    </div>
                    <div class="btn-small col" title="Color">
                        <input class="btn-small color-input" type="color" v-model="modeOptions.fill" @input="updateMenuOptions()">
                        <i class="fa fa-tint icon-shadow" :style="{color: modeOptions.fill}" aria-hidden="true"></i>
                        <label>color</label>
                    </div>
                    <div class="btn-small col" title="Reset Defaults" @click="resetModeOptions()">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                        <label>reset</label>
                    </div>
                </template>
                <template v-else-if="modeOptions && game.constructionMode.key === 'rectangle' || game.constructionMode.key === 'circle' || game.constructionMode.key === 'line'">
                    <div class="btn-small col">
                        <input class="btn-small small-number-input" title="Opacity" type="number" v-model.number="modeOptions.alpha" min="1" max="100" @input="updateMenuOptions()">
                        <label>opacity</label>
                    </div>
                    <template v-if="game.constructionMode.key === 'line'">
                        <div class="btn-small col" title="Front Arrow" :class="{ 'btn-active': modeOptions.frontArrow }" @click="modeOptions.frontArrow = !modeOptions.frontArrow; updateMenuOptions()">
                            <i class="fa fa-caret-left" aria-hidden="true"></i>
                            <label>arrow</label>
                        </div>
                        <div class="btn-small col" title="Back Arrow" :class="{ 'btn-active': modeOptions.backArrow }" @click="modeOptions.backArrow = !modeOptions.backArrow; updateMenuOptions()">
                            <i class="fa fa-caret-right" aria-hidden="true"></i>
                            <label>arrow</label>
                        </div>
                    </template>
                    <div v-if="game.constructionMode.key !== 'line'" title="Border" class="btn-small col" :class="{ 'btn-active': modeOptions.border }" @click="modeOptions.border = !modeOptions.border; updateMenuOptions()">
                        <i class="fa" :class="{ 'fa-square-o': game.constructionMode.key === 'rectangle', 'fa-circle-thin': game.constructionMode.key === 'circle' }" aria-hidden="true"></i>
                        <label>border</label>
                    </div>
                    <div v-if="game.constructionMode.key === 'line' || modeOptions.border" class="btn-small col">
                        <input class="btn-small small-number-input" title="Line Thickness" type="number" v-model.number="modeOptions.lineWidth" min="6" max="64" @input="updateMenuOptions()">
                        <label>thickness</label>
                    </div>
                    <div class="btn-small col" title="Color">
                        <input class="btn-small color-input" type="color" v-model="modeOptions.fillColor" @input="updateMenuOptions()">
                        <i class="fa fa-tint icon-shadow" :style="{color: modeOptions.fillColor}" aria-hidden="true"></i>
                        <label>color</label>
                    </div>
                    <div class="btn-small col" title="Reset Defaults" @click="resetModeOptions()">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                        <label>reset</label>
                    </div>
                </template>
                <!--
                <template v-else>
                    <button v-for="layer in game.constructionLayers" class="btn-small col" :title="layer.title" type="button" :class="{ 'layer-active': !layer.inactive, 'layer-inactive': layer.inactive }" @mouseenter="bme()" @click="toggleConstructionLayer(layer)">
                        <div v-if="layer.img" :style="{backgroundImage: 'url(/assets/game/Textures/UI/' + layer.img + ')'}"></div>
                        <i v-if="layer.icon" class="fa" :class="layer.icon" aria-hidden="true"></i>
                        <i v-if="layer.inactive" class="fa fa-ban position-absolute layer-inactive" aria-hidden="true"></i>
                    </button>
                </template>
                -->
                <template v-else>
                    <button class="btn-small construction-settings-button" @click="game.sidebarMenuComponent?.changeMenu('settings')" title="Filter Settings"><i class="fa fa-sliders" aria-hidden="true"></i></button>
                    <button class="btn-small construction-tech-button" @click="incrementTier()" title="Filter by Tier">{{'Tier ' + game.settings.selectedTier}}</button>
                    <div class="construction-category-wrapper">
                        <select class="btn-small app-input construction-category" @click="bmc()" title="Filter by Category" v-model="game.selectedBuildingCategory" @change="refresh()">
                            <option value="all">All Buildings</option>
                            <template v-for="(category, key) in buildingCategories">
                                <option v-if="game.settings.enableExperimental || key !== 'entrenchments'" :value="key">{{category.name}}</option>
                            </template>
                        </select>
                    </div>
                </template>
            </div>
        </div>
        <div class="menu-page">
            <template v-if="game.selectedBuildingCategory !== 'all'">
                <app-game-building-list-icon v-for="building in buildingCategories[game.selectedBuildingCategory].buildings" :building="building"/>
            </template>
            <template v-else>
                <template v-for="(category, key) in buildingCategories">
                    <template v-if="(game.settings.showCollapsibleBuildingList || key !== 'vehicles') && (game.settings.enableExperimental || key !== 'entrenchments')">
                        <div v-if="game.settings.showCollapsibleBuildingList" class="construction-item-category" @click="category.visible = !category.visible; refresh()">
                            {{category.name}}<i class="fa float-right" :class="{'fa-angle-down': category.visible, 'fa-angle-right': !category.visible}" style="margin-top: 2px;" aria-hidden="true"></i>
                        </div>
                        <div v-if="!game.settings.showCollapsibleBuildingList || category.visible">
                            <app-game-building-list-icon v-for="building in category.buildings" :test="this" :building="building"/>
                        </div>
                    </template>
                </template>
            </template>
        </div>
    </div>
    `
});

Vue.component('app-game-building-list-icon', {
    props: ['building'],
    methods: {
        buildBuilding: function(building) {
            this.bmc();
            game.create('building', building.key);
            game.sidebarMenuComponent.showHoverMenu(null);
        },
        buildingHover: function(building) {
            game.sidebarMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div v-if="(!building.hideInList || game.settings.enableExperimental) &&
        (!building.parent || game.settings.showUpgradesAsBuildings) &&
        (!building.techId || (game.settings.selectedTier === 2 && building.techId === 'unlockfacilitytier2') || game.settings.selectedTier === 3) &&
        (!game.settings.selectedFaction || (!building.faction || building.faction === game.settings.selectedFaction))"
        class="build-icon" :title="building.name" :style="{backgroundImage:'url(/assets/' + (building.parent?.icon ?? building.icon ?? 'default_icon.webp') + ')'}"
        @mouseenter="bme(); buildingHover(building)" @mouseleave="buildingHover(null)" @click="buildBuilding(building)">
    </div>
    `
});

Vue.component('app-menu-statistics', {
    props: ['menuData'],
    data() {
        return {
            cost: {},
            input: {},
            output: {},
            time: 3600,
            powerTotal: 0,
            powerProduced: 0,
            powerConsumed: 0,
            garrisonSupplies: 0,
        };
    },
    mounted() {
        this.refresh();
        game.statisticsMenuComponent = this;
    },
    methods: {
        sortKeys: function(list) {
            return Object.keys(list).sort().reduce((data, key) => {
                data[key] = list[key];
                return data;
            }, {});
        },
        refresh: function() {
            let cost = {};
            let input = {};
            let output = {};
            let powerTotal = 0;
            let powerProduced = 0;
            let powerConsumed = 0;
            let garrisonSupplies = 0;

            let garrisonConsumptionRate = Math.floor(this.time / 3600);
            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                // TODO: Need to actually get whether a structure decays or not from foxhole data.
                if (entity.type === 'building' && (entity.building?.category !== 'vehicles' && entity.building?.category !== 'misc')) {
                    garrisonSupplies += (2 * (entity.building?.garrisonSupplyMultiplier ?? 1)) * garrisonConsumptionRate;
                }
            }

            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    if (!buildingData) {
                        continue;
                    }

                    let productionSelected = typeof entity.selectedProduction === 'number';
                    // Always show power for buildings that have no production, but still should show in power for stats.
                    if (buildingData.key === 'field_modification_center' || buildingData.key === 'bms_foreman_stacker') {
                        productionSelected = true;
                    }

                    let power = productionSelected && buildingData.power ? buildingData.power : 0;
                    if (buildingData.cost) {
                        let costKeys = Object.keys(buildingData.cost);
                        for (let j = 0; j < costKeys.length; j++) {
                            let key = costKeys[j];
                            let value = buildingData.cost[key];
                            if (!cost[key]) {
                                cost[key] = 0;
                            }
                            cost[key] += value;
                        }
                    }

                    if (productionSelected && buildingData.production && buildingData.production.length) {
                        let selectedProduction;
                        buildingData.production.forEach(production => {
                            if (production.id === entity.selectedProduction) {
                                selectedProduction = production;
                            }
                        });
                        if (selectedProduction) {
                            if (selectedProduction.power) {
                                power = selectedProduction.power;
                            }

                            let productionCycles = ~~(this.time / selectedProduction.time);
                            if (typeof entity.productionScale === 'number') {
                                const productionTime = this.time / (selectedProduction.time > 3600 ? 86400 : 3600);
                                const productionLimit = productionTime < 1 ? entity.productionScale : ~~(entity.productionScale * productionTime);
                                productionCycles = Math.min(productionCycles, productionLimit);
                            }

                            if (productionCycles > 0) {
                                if (selectedProduction.input) {
                                    let inputKeys = Object.keys(selectedProduction.input);
                                    for (let j = 0; j < inputKeys.length; j++) {
                                        let key = inputKeys[j];
                                        let value = selectedProduction.input[key];
                                        if (!input[key]) {
                                            input[key] = 0;
                                        }
                                        input[key] += productionCycles * value;
                                    }
                                }

                                if (selectedProduction.output) {
                                    let outputKeys = Object.keys(selectedProduction.output);
                                    for (let j = 0; j < outputKeys.length; j++) {
                                        let key = outputKeys[j];
                                        let value = selectedProduction.output[key];
                                        if (!output[key]) {
                                            output[key] = 0;
                                        }
                                        output[key] += productionCycles * value;
                                    }
                                }

                                let inputKeys = Object.keys(input);
                                for (let j = 0; j < inputKeys.length; j++) {
                                    let key = inputKeys[j];
                                    if (output[key]) {
                                        let outputAmount = output[key];
                                        output[key] -= input[key];
                                        input[key] -= outputAmount;
                                        if (output[key] <= 0) {
                                            delete output[key];
                                        }
                                        if (input[key] <= 0) {
                                            delete input[key];
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // TODO: Sort resources by actual display name. Probably not worth doing. This is fine
                    input = this.sortKeys(input);
                    output = this.sortKeys(output);

                    powerTotal += power;
                    if (power > 0) {
                        powerProduced += power;
                    } else {
                        powerConsumed += power;
                    }
                }
            }

            this.cost = cost;
            this.input = input;
            this.output = output;
            this.powerTotal = powerTotal;
            this.powerProduced = powerProduced;
            this.powerConsumed = powerConsumed;
            this.garrisonSupplies = garrisonSupplies;

            this.$forceUpdate();
        },
    },
    template: html`
    <div style="text-align:left;">
        <div class="statistics-panel-header">
            <h3><i class="fa fa-bar-chart"></i> Statistics</h3><button class="close-statistics-button" @click="game.settings.enableStats = false; game.updateSettings()"><i class="fa fa-times"></i></button>
        </div>
        <div class="statistics-panel-body">
            <h4><i class="fa fa-wrench"></i> Construction Cost</h4>
            <div>
                <app-game-resource-icon v-for="(value, key) in cost" :resource="key" :amount="value"/>
            </div>
            <br>
            <h4><i class="fa fa-bolt"></i> Facility Power</h4>
            <div style="color:#d0d004; width:250px; margin:auto;">
                <span style="color:#03b003;">Produced: {{powerProduced}} MW</span><br>
                <span style="color:#d50101;">Consumed: {{powerConsumed}} MW</span><br>
                Total: {{powerTotal}} MW
            </div>
            <br>
            <select class="app-input" v-model="time" @change="refresh()">
                <option value="86400">Per 24 Hours</option>
                <option value="43200">Per 12 Hours</option>
                <option value="21600">Per 6 Hours</option>
                <option value="10800">Per 3 Hours</option>
                <option value="3600">Per 1 Hour</option>
                <option value="1800">Per 30 Minutes</option>
                <option value="900">Per 15 Minutes</option>
                <option value="60">Per 1 Minute</option>
            </select>
            <br><br>
            <app-game-resource-icon :resource="'garrisonsupplies'" :amount="garrisonSupplies"/>
            <br>
            <h4><i class="fa fa-sign-in"></i> Facility Input</h4>
            <div class="statistics-panel-fac-input">
                <app-game-resource-icon v-for="(value, key) in input" :resource="key" :amount="value"/>
            </div>
            <br>
            <h4><i class="fa fa-sign-out"></i> Facility Output</h4>
            <div class="statistics-panel-fac-output">
                <app-game-resource-icon v-for="(value, key) in output" :resource="key" :amount="value"/>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-settings', {
    props: ['menuData'],
    template: html`
    <div id="settings" class="text-left">
        <div class="settings-option-wrapper">
            <div class="settings-title">General Settings</div>
            <label class="app-input-label">
                <i class="fa fa-picture-o" aria-hidden="true"></i> Graphics
                <select class="app-input" v-model="game.settings.quality" v-on:change="game.updateQuality()">
                    <option value="auto">Auto</option>
                    <option value="high">High Quality</option>
                    <option value="low">Low Quality</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-volume-up" aria-hidden="true"></i> Volume
                <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" class="slider" @input="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-flag" aria-hidden="true"></i> Display Faction Colors
                <input class="app-input" type="checkbox" v-model="game.settings.displayFactionTheme" @change="game.updateSettings()">
            </label>
            <!--
            <label class="app-input-label">
                <i class="fa fa-flask" aria-hidden="true"></i> Enable Experimental Features
                <input class="app-input" type="checkbox" v-model="game.settings.enableExperimental" @change="game.updateSettings()">
            </label>
            -->
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Board Settings</div>
            <label class="app-input-label">
                <i class="fa fa-header" aria-hidden="true"></i> Display Facility Name
                <input class="app-input" type="checkbox" v-model="game.settings.showFacilityName" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-th-large" aria-hidden="true"></i> Snap Grid Size
                <input class="app-input" type="number" v-model="game.settings.gridSize" @input="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Snap Rotation Degrees
                <input class="app-input" type="number" v-model="game.settings.snapRotationDegrees" @input="game.updateSettings()">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Construction Settings</div>
            <label class="app-input-label">
                <i class="fa fa-folder-open" aria-hidden="true"></i> Default Category
                <select class="app-input" v-model="game.settings.defaultBuildingCategory" @change="game.updateSettings()">
                    <option value="all">All Buildings</option>
                    <template v-for="(category, key) in buildingCategories">
                        <option v-if="game.settings.enableExperimental || key !== 'entrenchments'" :value="key">{{category.name}}</option>
                    </template>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-users" aria-hidden="true"></i> Selected Faction
                <select class="app-input" v-model="game.settings.selectedFaction" @change="game.updateSettings()">
                    <option :value="null">Neutral</option>
                    <option value="c">Colonials</option>
                    <option value="w">Wardens</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-sitemap" aria-hidden="true"></i> Selected Tech Tier
                <select class="app-input" v-model.number="game.settings.selectedTier" @change="game.updateSettings()">
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-compress" aria-hidden="true"></i> Show Collapsible Building List
                <input class="app-input" type="checkbox" v-model="game.settings.showCollapsibleBuildingList" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-chevron-circle-up" aria-hidden="true"></i> Show Upgrades in Building List
                <input class="app-input" type="checkbox" v-model="game.settings.showUpgradesAsBuildings" @change="game.updateSettings()">
            </label>
        </div>
    </div>
    `
});

Vue.component('app-menu-save-load', {
    props: ['menuData'],
    data() {
        return {
            importAsSelection: false,
            presetName: null
        };
    },
    methods: {
        openFileBrowser: function(importAsSelection) {
            this.importAsSelection = importAsSelection;
            document.getElementById('fileUpload').click();
        },
        loadSave: function(saveObject) {
            try {
                if (typeof saveObject === 'string') {
                    saveObject = JSON.parse(saveObject);
                }
                if (saveObject.name && !this.importAsSelection) {
                    game.facilityName = saveObject.name;
                    game.appComponent.$forceUpdate();
                }
                game.loadSave(saveObject, this.importAsSelection);
                this.$forceUpdate();
            } catch (e) {
                console.error('Failed to load save:', e);
                game.showGrowl('Failed to load save.');
            }
        },
        fetchPreset: function() {
            if (this.presetName !== null) {
                this.importAsSelection = false;
                fetch(`./assets/presets/${this.presetName}.json`).then(response => {
                    return response.json();
                }).then(saveObject => this.loadSave(saveObject)).catch(e => {
                    console.error('Failed to load preset:', e);
                    game.showGrowl('Failed to load preset.');
                });
            }
        },
        loadFile: function() {
            let file = this.$refs.file.files[0];
            let reader = new FileReader();
            let component = this;
            reader.onload = function() {
                let decoder = new TextDecoder("utf-8");
                component.loadSave(decoder.decode(new Uint8Array(this.result)));
            };
            reader.readAsArrayBuffer(file);
        },
        updateName: function() {
            if (game.facilityName === '') {
                game.facilityName = 'Unnamed Facility';
            }
            this.$forceUpdate();
            game.appComponent.$forceUpdate();
        }
    },
    template: html`
    <div id="save-load-page">
        <input id="fileUpload" @change="loadFile()" type="file" ref="file" hidden>
        <div class="settings-option-wrapper">
            <div class="settings-title">Facility Properties</div>
            <label class="app-input-label facility-name-input">
                <i class="fa fa-pencil-square edit-icon" aria-hidden="true"></i>
                <input class="app-input" type="text" v-model="game.facilityName" @change="updateName()">
            </label>
            <div class="text-center">
                <button class="app-btn app-btn-primary load-button" type="button" v-on:click="openFileBrowser()" @mouseenter="bme()">
                    <i class="fa fa-upload"></i> Load
                </button>
                <button class="app-btn app-btn-primary save-button" type="button" v-on:click="game.downloadSave()" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Save
                </button>
            </div>
        </div>
        <div v-if="game.settings.enableExperimental" class="settings-option-wrapper">
            <div class="settings-title">Facility Presets</div>
            <div class="text-center">
                <div class="select-preset-wrapper">
                    <select title="Load a Preset" v-model="presetName">
                        <option v-bind:value="null">Choose a Preset</option>
                        <option value="all_structures">All Buildings + Upgrades</option>
                        <option value="small_120mm_facility">Small 120mm Facility</option>
                        <option value="bunker_test">Bunker Testing</option>
                        <option value="train_test">Train Testing</option>
                    </select>
                </div>
                <button class="preset-load-button" type="button" v-on:click="fetchPreset()" @mouseenter="bme()">
                    <i class="fa fa-upload"></i> Load
                </button>
            </div>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Selection Options</div>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" v-on:click="openFileBrowser(true)" @mouseenter="bme()">
                    <i class="fa fa-upload"></i> Import Selection
                </button>
                <button v-if="game.getSelectedEntities().length > 1" class="text-button" type="button" v-on:click="game.downloadSave(true)" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Export Selection
                </button>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-about', {
    props: ['menuData'],
    methods: {
        buildBuilding: function(buildingKey) {
            this.bmc();
            game.createBuildingAtCenter(buildingKey);
        }
    },
    template: html`
    <div id="about-page">
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-question-circle"></i> What is Foxhole Planner?</div>
            <p>
                This is a tool that allows you to draw up plans for facilities from Foxhole's Inferno update.
            </p>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-keyboard-o " aria-hidden="true"></i> Controls + Hotkeys</div>
            <div class="controls-section-body">
                <div class="middle-mouse-button"></div> Move board position.<br>
                <div class="middle-mouse-button"></div> Scroll to zoom in/out board.
                <hr>
                <div class="left-mouse-button"></div> Select a single structure.<br>
                <div class="left-mouse-button"></div> Drag to select multiple structures.<br>
                <div class="right-mouse-button"></div> Rotate selected structures.
                <hr>
                <div class="keyboard-key">ctrl</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">A</div> Select all structures.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">C</div> Clone selection.
                <hr>
                <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Snap structure to grid.
                <hr>
                <div class="keyboard-key">L</div> Toggle lock for selected structures.<br>
                <div class="keyboard-key">P</div> Toggle production output icons.<br>
                <div class="keyboard-key">del</div> Delete selected structures.<br>
                <div class="keyboard-key">esc</div> Clear selection.<br>
                <div class="keyboard-key">F2</div> Debug menu.
            </div>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-code" aria-hidden="true"></i> Project Credits</div>
            <div class="text-center">
                Made with ❤️ by <a href="https://bombsightgames.com/" target="_blank">Ray</a> and <a href="https://github.com/jimdcunningham" target="_blank">Jimbo</a>.<br>
                <hr>
                <p style="font-size:10px;">
                    <a href="https://www.foxholegame.com/" target="_blank">Foxhole</a> is a registered trademark of <a href="https://www.siegecamp.com/" target="_blank">Siege Camp</a>.<br>
                    We are not affiliated with Siege Camp, this is a fan project.
                </p>
            </div>
        </div>
        <span style="font-size:7px; cursor:pointer; " @click="buildBuilding('sound_test')">worden smely 🤮</span>
    </div>
    `
});