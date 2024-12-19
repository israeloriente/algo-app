## [3.7.1](https://github.com/israeloriente/logiface/compare/3.7.0...3.7.1) (2023-01-29)


### Bug Fixes

* **app.module:** disabling load spinner ([9ebd390](https://github.com/israeloriente/logiface/commit/9ebd3907c3ab5fc5149e914fc87937c15e6c8925))
* prevent black screen erro when user dont have session ([906eefe](https://github.com/israeloriente/logiface/commit/906eefe392a6c6568c5a01ec8a740da897a243b7))



# [3.7.0](https://github.com/israeloriente/logiface/compare/3.6.2...3.7.0) (2022-12-06)


### Bug Fixes

* **logs:** prevent "{}" response to database ([49c7206](https://github.com/israeloriente/logiface/commit/49c720693571fd082b7b80c1198a75fbdf9d2ec3))
* prevent automatic translation [#59](https://github.com/israeloriente/logiface/issues/59) ([b3dc2a9](https://github.com/israeloriente/logiface/commit/b3dc2a9d1df2e12f240979b04d2fcbca7efad552))
* prevent error log from web ([057fd60](https://github.com/israeloriente/logiface/commit/057fd6006b7aba26c0790185e525a115fd2096d2))
* **swUpdate:** verify updates is back and fixed infinite loop ([d1e6a2d](https://github.com/israeloriente/logiface/commit/d1e6a2d74155983c8497e1759421961bc42a9e47))


### Features

* **rendimentos:** unlocking PWA rendimentos ([5693549](https://github.com/israeloriente/logiface/commit/569354934e3c19b890384c9198870523a4a9de35))
* **report:** detecting uncaught erros [#59](https://github.com/israeloriente/logiface/issues/59) ([cae10f2](https://github.com/israeloriente/logiface/commit/cae10f2c35ea3a071f61165f14fe8f019023e5ad))


### Performance Improvements

* avoiding to call getAppVersion() 2 times ([13982f3](https://github.com/israeloriente/logiface/commit/13982f364412b08ea5176db4fe8ea9ccb3a1f9b2))
* hiding "load imgs" button when a image fails (rm relational [#69](https://github.com/israeloriente/logiface/issues/69)) ([2151576](https://github.com/israeloriente/logiface/commit/2151576888e1a196bb8f29a3b55a7fa8aef14195))
* protecting a little bit more "allAlerts" list if not exist,, ([4b608b1](https://github.com/israeloriente/logiface/commit/4b608b178bb381f65c58ae8b822342651dc042d1))
* retrieving mileage from the previous car [#63](https://github.com/israeloriente/logiface/issues/63) ([0ce222e](https://github.com/israeloriente/logiface/commit/0ce222eaa6f5015f566c239156d2c3e89d276d04))
* **versionControl:** disabled update checks + report when usr outdated ([eea69f9](https://github.com/israeloriente/logiface/commit/eea69f9b18f300e63e3958463d4814023d558902))



## [3.6.2](https://github.com/israeloriente/logiface/compare/3.6.1...3.6.2) (2022-07-22)


### Bug Fixes

* send impro images [#57](https://github.com/israeloriente/logiface/issues/57) ([fc3172b](https://github.com/israeloriente/logiface/commit/fc3172b2726eb91e2a85278220ce0682209c26a8))



## [3.6.1](https://github.com/israeloriente/logiface/compare/3.6.0...3.6.1) (2022-07-20)


### Bug Fixes

* **3.6.0:** loop infinito na atualização ([01acb9e](https://github.com/israeloriente/logiface/commit/01acb9ebb5b73a0d64d6040a6bdb9d98ffe3bf35))



# [3.6.0](https://github.com/israeloriente/logiface/compare/3.5.0...3.6.0) (2022-07-20)


### Features

* **addPlateModal:** km required [#53](https://github.com/israeloriente/logiface/issues/53) ✅ ([41e252b](https://github.com/israeloriente/logiface/commit/41e252be967790b5a03bbb8c5c78d9244da5e6e3))
* **addPlateModal:** questioning accessories [#52](https://github.com/israeloriente/logiface/issues/52) ✅ ([b846bdc](https://github.com/israeloriente/logiface/commit/b846bdc931cdb95ef2f412a168cfa7ecf5e0168e))
* **translate:** changing confirmAlerts with ngx-translate ([ac859ec](https://github.com/israeloriente/logiface/commit/ac859ec4641f4264d200c87377b30a823bac3a5c))


### Performance Improvements

* log classs improved [#46](https://github.com/israeloriente/logiface/issues/46) ([30a1623](https://github.com/israeloriente/logiface/commit/30a1623762c9ecb1c00ba576887e58efcd674588))



# [3.5.0](https://github.com/israeloriente/logiface/compare/3.4.1...3.5.0) (2022-05-10)


### Bug Fixes

* dependences fixed ([dbadb08](https://github.com/israeloriente/logiface/commit/dbadb08314469c79cf8b305065326bb4286c97af))


### Features

* **recibos:** [#50](https://github.com/israeloriente/logiface/issues/50) done ✅ ([f0a224c](https://github.com/israeloriente/logiface/commit/f0a224cb6f90f3c7da591691f1d8f463c41f5098))



### Changelog

#### [3.4.1](https://github.com/israeloriente/logiface/compare/3.4.0...3.4.1)

### New feature:

- **parseService**: adicionando nome da imagem e impro pointer na classe "Files"([`e22c110`](https://github.com/israeloriente/logiface/commit/e22c1103392fd0523abbe92a4d6385b94e3ce41e)) (by israeloriente)
- verified-svg-component created #47 ✅([`b41a87a`](https://github.com/israeloriente/logiface/commit/b41a87aa654093935acebf6436d5cad08b233f1a)) (by israeloriente)

### Bugs fixed:

- corrigindo problema de imagens salvarem mais de uma vez após 2 tentativa #47([`1d715dd`](https://github.com/israeloriente/logiface/commit/1d715dd7d65de4338400ef3e245570e0c00e3b30)) (by israeloriente)
- **add-plate-modal/envioComponent**: attempts variables to fix "tryAgain" button([`1ef234b`](https://github.com/israeloriente/logiface/commit/1ef234bbfc0e0e260d136eccf6ad70995244b2be)) (by israeloriente)
- #47 ✅([`29cb9ce`](https://github.com/israeloriente/logiface/commit/29cb9ceb19b6a811f2d77cdffcd5e2b8ae434af8)) (by israeloriente)

### Performance improves:

- **improComponent**: definido um loading específico para compressão de imagens([`3625d61`](https://github.com/israeloriente/logiface/commit/3625d611a51685c63f872d381d9f98436a0323f3)) (by israeloriente)
- criação de interface "Photo" e Impro parse server (Antigo impro renomeado para ImproConfig)([`31d8d1c`](https://github.com/israeloriente/logiface/commit/31d8d1cc838db47e4de103ec14abb8d1020da054)) (by israeloriente)


- refactor: remoção de funções inutilizadas [`c4763f6`](https://github.com/israeloriente/logiface/commit/c4763f691c7564fbaab324c2e7723138d7d46fee)

#### [3.4.0](https://github.com/israeloriente/logiface/compare/3.3.3...3.4.0)

> 14 March 2022

- v3.4.0 [`#48`](https://github.com/israeloriente/logiface/pull/48)
- feat: redirecionamento e direção para instalação do PWA [`59198b2`](https://github.com/israeloriente/logiface/commit/59198b271864975ad083e248ead3ab74a129f1de)
- refactor: update changelog [`3675dde`](https://github.com/israeloriente/logiface/commit/3675dde983e3df3475eb02667ca0a51a962984c1)
- feat: adicionamos Service Worker [`42ff969`](https://github.com/israeloriente/logiface/commit/42ff96932eafff2450a284515202ad14e252eff3)

#### [3.3.3](https://github.com/israeloriente/logiface/compare/3.3.0...3.3.3)

> 23 February 2022

- v3.3.3 [`#44`](https://github.com/israeloriente/logiface/pull/44)
- Melhorias danos images [`#39`](https://github.com/israeloriente/logiface/pull/39)
- fix(improComponent): fixed #33, #34 ✅ [`#33`](https://github.com/israeloriente/logiface/issues/33)
- refactor(): angular updated 11 &gt; 13 ✅ [`0993840`](https://github.com/israeloriente/logiface/commit/0993840bbaf3dec44df12ea7adb6e7312ad0deab)
- perf: using ImagePicker for select images [`a2acf42`](https://github.com/israeloriente/logiface/commit/a2acf4269a0e8501018971ab70fb49d6a9b6183d)
- feat(src/app): aumento de 8 imagens para 20 #38 ✅ [`84b8de1`](https://github.com/israeloriente/logiface/commit/84b8de11f4c0d405c1092fdb2f0b44bb48986676)

#### [3.3.0](https://github.com/israeloriente/logiface/compare/3.2.0...3.3.0)

> 2 February 2022

- Envio dos danos e acessórios [`#37`](https://github.com/israeloriente/logiface/pull/37)
- feat(src/app): implementação dos danos (impro) #27 ✅ [`eff0a55`](https://github.com/israeloriente/logiface/commit/eff0a55ccdd3f255d77412b73f9a761ae78c5587)
- feat(app): adicionado acessórios #30 ✅ [`e2b00f7`](https://github.com/israeloriente/logiface/commit/e2b00f73b59ad82ebf40fc500f5d5488facc0383)
- build: capacitor-camera added [`73380b5`](https://github.com/israeloriente/logiface/commit/73380b50dfd01cd844b8101b4653e26c6fc79263)

#### [3.2.0](https://github.com/israeloriente/logiface/compare/3.1.3...3.2.0)

> 21 January 2022

- Criação dos abastecimentos [`#31`](https://github.com/israeloriente/logiface/pull/31)
- refactor: tornando info-car e add-plate-modal híbridos (Abastecimentos e Movimentos) [`eeeac22`](https://github.com/israeloriente/logiface/commit/eeeac2226fb7b9ce77fc904f0d856914c992d1b0)
- feat: adicionando AbastecimentoPage [`7932b3b`](https://github.com/israeloriente/logiface/commit/7932b3bd3437731019ca89be160b8555e715ce65)
- refactor(services): criação de Abs, Mov e Rend ligada as cloud functions e atualização momentjs [`92e8a74`](https://github.com/israeloriente/logiface/commit/92e8a74d95760567bbbc28b6351f07efa1d4bee2)

#### [3.1.3](https://github.com/israeloriente/logiface/compare/3.1.1...3.1.3)

> 11 November 2021

- 3.1.3 [`#24`](https://github.com/israeloriente/logiface/pull/24)
- fix: jobStart e jobEnd estavam trocados na função de criação do parse [`2034c6a`](https://github.com/israeloriente/logiface/commit/2034c6aa7a8ddbd280243e3af0c249b1065597e7)
- fix(add-rendimentos): correção teve que ser refeita [`1503e79`](https://github.com/israeloriente/logiface/commit/1503e79b9730b07e8718d2b3bcd88a851620b375)
- fix(add-rendimentos): correção na adição de horas [`8596993`](https://github.com/israeloriente/logiface/commit/8596993794b094e778a6cc2b18a6e50688475482)

#### [3.1.1](https://github.com/israeloriente/logiface/compare/3.1.0...3.1.1)

> 9 November 2021

- 3.1.1 [`#23`](https://github.com/israeloriente/logiface/pull/23)
- fix(app): removendo variáveis descontinuadas [`ba8054c`](https://github.com/israeloriente/logiface/commit/ba8054c4170370ac986d45b29ad94c8a19c5c714)
- fix(add-rendimento-modal): correção do horário de verão mudando a hora [`1a22dc2`](https://github.com/israeloriente/logiface/commit/1a22dc2f4ec2ecf2805d4f1ae4b310cce23fa54f)
- fix(parse-service): modificando idempotency de 1s para 10s [`7096822`](https://github.com/israeloriente/logiface/commit/7096822d04c9ad83c19a433ee48489ca190c71bc)

#### [3.1.0](https://github.com/israeloriente/logiface/compare/3.1.0-next.1...3.1.0)

> 18 October 2021

#### [3.1.0-next.1](https://github.com/israeloriente/logiface/compare/3.0.1...3.1.0-next.1)

> 18 October 2021

- v3.1.0-next.1 [`#20`](https://github.com/israeloriente/logiface/pull/20)
- build: integração commitzen | husky [`ab78dae`](https://github.com/israeloriente/logiface/commit/ab78dae1ddc00d8ce172a26f9137349a986cb454)
- Updated parse 2.19 -&gt; 3.3 and Npm audit fixed [`f6703bf`](https://github.com/israeloriente/logiface/commit/f6703bf7e683ebf4c7e7a0e5fa195432a65c2f43)
- Added Cypress Tester [`62d45dd`](https://github.com/israeloriente/logiface/commit/62d45dd1a09d71b421dac75b4ac5efdd0c7550fa)

#### [3.0.1](https://github.com/israeloriente/logiface/compare/3.0.0...3.0.1)

> 25 May 2021

- Atualização para 3.0.1 [`#8`](https://github.com/israeloriente/logiface/pull/8)
- Nada importante [`e1b2e39`](https://github.com/israeloriente/logiface/commit/e1b2e39837a7ce76244edf4b2842e6be0693da4f)
- Criação do ipa iOS [`5e9327a`](https://github.com/israeloriente/logiface/commit/5e9327aa118d1998709cddee2164d35027383824)
- Correções do issue #6 [`e2607d1`](https://github.com/israeloriente/logiface/commit/e2607d1ff04ff97203604a0f6e7ef71573de8099)

#### 3.0.0

> 17 May 2021

- Publicação da versão 3.0 Android [`#1`](https://github.com/israeloriente/logiface/pull/1)
- Backup Gitlab (v2.8.5) [`57226cd`](https://github.com/israeloriente/logiface/commit/57226cd6422a1f83694e33039a816e74962aaea0)
- Inicio de desenvolvimento Github [`57f8f2d`](https://github.com/israeloriente/logiface/commit/57f8f2df833508676436607329993bf2509510a5)
- Package.json reconfigurado e parse sandbox alterado [`2a3ae35`](https://github.com/israeloriente/logiface/commit/2a3ae3574401c9c9fed7953a9081e80503fe9b48)
