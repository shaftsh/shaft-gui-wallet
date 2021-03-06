import {Component, Inject, OnInit} from '@angular/core';
import BigNumber from "bignumber.js";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {CreateAccountDialog} from "../accounts/accounts.component";
import {NotificationService} from "../service/notification/notification.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IPCService} from "../service/ipc/concrete/ipc.service";
import {AccountInfo} from "../model/AccountInfo";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
  providers: [NotificationService]
})
export class SendComponent implements OnInit {

  private accounts: AccountInfo[];
  private from: string;
  private to: string;
  private value: number;
  private advanced: boolean;
  private form: FormGroup;
  private error: boolean;

  constructor(private IPCService: IPCService, public dialog: MatDialog, private fb: FormBuilder, private NotificationService: NotificationService) {
    this.from = null;
    this.to = null;
    this.value = null;

    this.accounts = [];
    IPCService.getAccounts().then((accounts) => {
      accounts.forEach((account) => {
        let accountInfo = new AccountInfo();
        accountInfo.address = account;
        this.accounts.push(accountInfo);

        this.IPCService.getBalance(account).then((balance) => {
          let fromCache = this.accounts.find(accInfo => accInfo.address == account);
          if (fromCache) {
            fromCache.balance = balance;
          } else {
            let obj = new AccountInfo();
            obj.address = account;
            obj.balance = balance;
            this.accounts.push(obj);
          }
        }, err => {
          this.NotificationService.notificate("Could not get balance for address: " + err);
        });
      })
    }, err => {
      this.NotificationService.notificate("Could not account list: " + err);
    });

    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['', [Validators.required, Validators.pattern(/^(0x)([0-9a-z]{40,40})+$/)]],
      value: ['', Validators.required]
    });
  }

  public formatBalance(balance, digitsAfterPoint) {
    return Math.round((balance / 1000000000000000000) * Math.pow(10, digitsAfterPoint)) / Math.pow(10, digitsAfterPoint);
  }

  public getAccountsWithNonZeroBalance() {
    return this.accounts.filter(account => account.balance && account.balance > 0);
  }

  ngOnInit() {

  }

  openSendDialog(): void {
    let from = this.form.controls.from.value;
    let to = this.form.controls.to.value;
    let value = this.form.controls.value.value;

    let dialogRef = this.dialog.open(SendDialog, {
      width: '50%',
      data: {from: from, to: to, value: value}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Submitting sending new transaction:', result);

        let valueInShf = new BigNumber(value);
        let valueInWei = valueInShf.mul(new BigNumber(1000000000000000000));

        let obj = {from: from, to: to, value: valueInWei.toString(10)};
        console.log(obj);
        this.IPCService.sendTransaction(obj).then(result => {
          this.NotificationService.notificate('Successfully sent transaction, txid: ' + result);
          console.log(result);
          this.form.reset();
          this.form.controls.from.setErrors(null);
          this.form.controls.to.setErrors(null);
          this.form.controls.value.setErrors(null);
        }, error => {
          console.log('Error pushing transaction:', error);
        })
      }
    });
  }


  sendTransaction() {
    if (!this.form.controls.from.value && !this.form.controls.to.value && !this.form.controls.value.value) {
      console.log('Not enough arguments to send transaction');
      return;
    }
    let from = this.form.controls.from.value;
    let to = this.form.controls.to.value
    let value = this.form.controls.value.value;
    let valueInWei = new BigNumber(value).mul(new BigNumber(1000000000000000000));
    let inShf = new BigNumber(value);
    //todo validate
    console.log(`Sending from ${from} to ${to} [SHF: ${inShf.toString(10)}, WEI: ${valueInWei.toString(10)}]`);
    this.IPCService.sendTransaction({from: from, to: to, value: to}).then((receipt) => {
      console.log('Success', receipt);
    }, err => {
      console.log('Error while sending transaction', err);
      this.error = true;
    })
  }


}

@Component({
  selector: 'send-dialog',
  templateUrl: 'send-dialog.html',
  styleUrls: ['./send-dialog.css'],
  providers: [NotificationService]
})
export class SendDialog {

  private password: string;
  private unlocked: boolean;
  private unlocking: boolean;
  private passwordInvalid: boolean;

  constructor(public dialogRef: MatDialogRef<CreateAccountDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any, private IPCService: IPCService, private NotificationService: NotificationService) {
    this.password = null;
    this.unlocked = false;
    this.unlocking = false;
    this.passwordInvalid = false;
  }

  public lockAccount(account) {
    this.IPCService.lockAccount(account).then((locked) => {
      console.log('Account locked', locked);
    }, err => {
      console.log(err)
    })
  }

  public unlockAccount(account, password) {
    console.log(this.data);
    this.unlocking = true;
    this.IPCService.unlockAccount(account, password).then((unlocked: boolean) => {
      this.unlocking = false;
      console.log('Account unlocked', unlocked);
      this.unlocked = unlocked;
      if (unlocked) {
        this.unlocked = true;
        this.passwordInvalid = false;
      }
    }, err => {
      console.log(err);
      this.unlocking = false;
      if (err === 'could not decrypt key with given passphrase') {
        this.passwordInvalid = true;
        this.NotificationService.notificate("Unlocking account failed. Invalid password.");
      }
      else {
        this.NotificationService.notificate("Could not unlock account : " + err);
      }

    })
  }

  onNoClick(): void {
    this.data.password = null;
    this.dialogRef.close();
  }


}
