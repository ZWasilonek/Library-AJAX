package pl.codeschool.rest.service;

import pl.codeschool.rest.model.Book;

import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;

public class MockBookList {
    private static final CopyOnWriteArrayList<Book> cList = new CopyOnWriteArrayList<>();

    private static final AtomicInteger counter = new AtomicInteger(1);

    static {
        cList.add(
            new Book.BookBuilder().id(counter.getAndIncrement())
                .title("Thiniking in Java")
                .isbn("9788324631766")
                .author("Bruce Eckel")
                .publisher("Prentice Hall")
                .type("programming")
                .build()
        );
        cList.add(
            new Book.BookBuilder().id(counter.getAndIncrement())
                .title("Rusz głową Java")
                .isbn("9788324627738")
                .author("Sierra Kathy, Bates Bert")
                .publisher("Helion")
                .type("programming")
                .build()
        );
        cList.add(
            new Book.BookBuilder().id(counter.getAndIncrement())
                .title("Java 2. Podstawy")
                .isbn("9780130819338")
                .author("Cay Horstmann, Gary Cornell")
                .publisher("Nowy dzień")
                .type("programming")
                .build()
        );
        cList.add(
            new Book.BookBuilder().id(counter.getAndIncrement())
                .title("JavaScript - podstawy")
                .isbn("8436023479338")
                .author("Jan Kowalski")
                .publisher("Replika")
                .type("programming")
                .build()
        );
        cList.add(
            new Book.BookBuilder().id(counter.getAndIncrement())
                .title("JavaScript i jQuery")
                .isbn("2694739538325")
                .author("Jon Duckett")
                .publisher("Helion")
                .type("programming")
                .build()
        );

    }

    public static void addBook(Book book) {
        book.setId(counter.getAndIncrement());
        cList.add(book);
    }

    private MockBookList() {
    }

    public static CopyOnWriteArrayList<Book> getInstance() {
        return cList;
    }

}