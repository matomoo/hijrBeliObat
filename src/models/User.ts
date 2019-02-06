import { observable } from 'mobx';

class User {
  @observable private _displayName: string;
  @observable private _age: number;
  @observable private _job: string;

  @observable private _uid: string;
  @observable private _userRole: string;
  @observable private _userNamaLengkap: string;
  @observable private _userHandphone: string;
  @observable private _userAlamat: string;
  @observable private _userBadge1: string;
  @observable private _userBadge2: string;
  @observable private _userBadge3: string;
  @observable private _userTerms: string;
  @observable private _userAvatar1: string;
  @observable private _userAuth: string;

  @observable private _userPilihObatAktif: string;

  public get displayName(): string {
    return this._displayName;
  }

  public set displayName(value: string) {
    this._displayName = value;
  }

  public get age(): number {
    return this._age;
  }

  public set age(value: number) {
    this._age = value;
  }

  public get job(): string {
    return this._job;
  }
  public set job(value: string) {
    this._job = value;
  }

  public get uid(): string {
    return this._uid;
  }
  public set uid(value: string) {
    this._uid = value;
  }

  public get userRole(): string {
    return this._userRole;
  }
  public set userRole(value: string) {
    this._userRole = value;
  }

  public get userNamaLengkap(): string {
    return this._userNamaLengkap;
  }
  public set userNamaLengkap(value: string) {
    this._userNamaLengkap = value;
  }

  public get userHandphone(): string { return this._userHandphone; }
  public set userHandphone(value: string) { this._userHandphone = value; }

  public get userAlamat(): string { return this._userAlamat; }
  public set userAlamat(value: string) { this._userAlamat = value; }

  public get userBadge1(): string { return this._userBadge1; }
  public set userBadge1(value: string) { this._userBadge1 = value; }

  public get userBadge2(): string { return this._userBadge2; }
  public set userBadge2(value: string) { this._userBadge2 = value; }

  public get userBadge3(): string { return this._userBadge3; }
  public set userBadge3(value: string) { this._userBadge3 = value; }

  public get userTerms(): string { return this._userTerms; }
  public set userTerms(value: string) { this._userTerms = value; }

  public get userAvatar1(): string { return this._userAvatar1; }
  public set userAvatar1(value: string) { this._userAvatar1 = value; }

  public get userPilihObatAktif(): string { return this._userPilihObatAktif; }
  public set userPilihObatAktif(value: string) { this._userPilihObatAktif = value; }

  public get userAuth(): string { return this._userAuth; }
  public set userAuth(value: string) { this._userAuth = value; }

}

export default User;
