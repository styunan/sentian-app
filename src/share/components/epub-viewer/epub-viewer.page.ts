import { AfterViewInit, Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Book } from 'epubjs';

@Component({
  selector: 'app-epub-viewer',
  templateUrl: 'epub-viewer.page.html',
  styleUrls: ['epub-viewer.page.scss'],
})
export class EpubViewerPage implements AfterViewInit {
  @Input() url: string;
  title = '';
  book: Book;

  constructor(private modalCtrl: ModalController) {
  }

  ngAfterViewInit(): void {
    this.open();
  }

  open() {
    this.book = new Book(this.url);
    const viewer = document.getElementById('viewer');
    const rendition = this.book.renderTo(viewer, {
      manager: 'continuous',
      flow: 'paginated',
      width: '100%',
      height: '100%',
      snap: true,
    });

    this.book.loaded.metadata.then((meta: any) => {
      const auther = meta.author || '小妖';
      this.title = meta.title + ' – ' + auther;
    });

    const displayed = rendition.display();

    const loader: any = document.getElementById('loader');
    displayed.then((renderer) => {
      // -- do stuff
      loader.hidden = true;
    });

    // Navigation loaded
    this.book.loaded.navigation.then((toc) => {
      // console.log(toc);
    });

    const next = document.getElementById('next');
    next.addEventListener(
      'click',
      () => {
        rendition.next();
      },
      false
    );

    const prev = document.getElementById('prev');
    prev.addEventListener(
      'click',
      () => {
        rendition.prev();
      },
      false
    );

    document.addEventListener(
      'keyup',
      (e: any) => {
        // Left Key
        if ((e.keyCode || e.which) === 37) {
          rendition.prev();
        }

        // Right Key
        if ((e.keyCode || e.which) === 39) {
          rendition.next();
        }
      },
      false
    );
  }

  dismiss() {
    this.book.destroy();
    this.modalCtrl.dismiss({
      pdfHistory: 'this.pdfHistory',
    });
  }
}
