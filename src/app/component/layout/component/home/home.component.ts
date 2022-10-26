import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ipcRenderer } from 'electron';
import { PasswordService } from '../../../../service/password.service';
import { debounceTime, distinctUntilChanged, startWith, Subject } from 'rxjs';
import { CreatePassword } from './form-input/create-password';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PasswordList } from './interface/password-list';
import { PageEvent } from '@angular/material/paginator';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreatePasswordDialogComponent } from './component/create-password-dialog/create-password-dialog.component';
import { ShowDescriptionDialogComponent } from './component/show-description-dialog/show-description-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'username',
    'password',
    'uri',
    'description',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  data: PasswordList = { total: 0, items: [] };

  listChunk: any = {
    pageSize: null,
    pageIndex: null,
    query: null,
  };

  filterQuery = new FormControl(null);

  constructor(
    private passwordService: PasswordService,
    private ngZone: NgZone,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterQuery.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        this.listChunk.query = value;
        ipcRenderer.send('password-list-chunk', this.listChunk);
      });

    this.initDataLoad();
  }

  ngOnDestroy() {
    ipcRenderer.send('password-list-end');
  }

  createPassword() {
    ipcRenderer.send('password-create-start');

    const subject = new Subject<CreatePassword>();

    subject.pipe(untilDestroyed(this)).subscribe((chunk) => {
      ipcRenderer.send('password-create-chunk', chunk);
    });

    subject.next({
      password: 'testPhrase',
      uri: 'discord.com',
      description: 'Some password',
      imageSrc: 'discord.com',
      username: 'Lorem ipsum',
    });

    ipcRenderer.send('password-create-end');
  }

  onPage({ pageSize, pageIndex }: PageEvent) {
    this.listChunk.pageSize = pageSize;
    this.listChunk.pageIndex = pageIndex;

    ipcRenderer.send('password-list-chunk', this.listChunk);
  }

  initDataLoad() {
    ipcRenderer.send('password-list-end');
    ipcRenderer.send('password-list-start');
    this.listChunk.pageSize = 10;
    this.listChunk.pageIndex = 0;

    ipcRenderer.send('password-list-chunk', this.listChunk);
    ipcRenderer.removeAllListeners('password-list-data');
    ipcRenderer.on(
      'password-list-data',
      (event, passwordList: PasswordList) => {
        this.ngZone.run(() => {
          this.data = passwordList;
        });
      }
    );
  }

  getTimezone() {
    return (
      '+' +
      Number(
        new Date()
          .toString()
          .match(/([A-Z]+[+-]\d+.*)/)[1]
          .split(' (')[0]
          .replace(/[A-Z]+/, '')
      ) *
        2
    );
  }

  openCreatePasswordDialog() {
    this.matDialog
      .open(CreatePasswordDialogComponent)
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.ngZone.run(() => {
          this.initDataLoad();
        });
      });
  }

  openShowDescriptionDialog(description: string) {
    this.matDialog.open(ShowDescriptionDialogComponent, { data: description });
  }
}
