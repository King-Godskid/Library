insert into authors (name) values
  ('Chinua Achebe'),
  ('Chimamanda Ngozi Adichie'),
  ('Buchi Emecheta'),
  ('Ngũgĩ wa Thiong''o'),
  ('Wole Soyinka');

insert into books (title, year, author_id) values
  ('Things Fall Apart', 1958, (select id from authors where name = 'Chinua Achebe')),
  ('No Longer at Ease', 1960, (select id from authors where name = 'Chinua Achebe')),
  ('Arrow of God', 1964, (select id from authors where name = 'Chinua Achebe')),
  ('Half of a Yellow Sun', 2006, (select id from authors where name = 'Chimamanda Ngozi Adichie')),
  ('Purple Hibiscus', 2003, (select id from authors where name = 'Chimamanda Ngozi Adichie')),
  ('Americanah', 2013, (select id from authors where name = 'Chimamanda Ngozi Adichie')),
  ('The Joys of Motherhood', 1979, (select id from authors where name = 'Buchi Emecheta')),
  ('Second-Class Citizen', 1974, (select id from authors where name = 'Buchi Emecheta')),
  ('A Grain of Wheat', 1967, (select id from authors where name = 'Ngũgĩ wa Thiong''o')),
  ('The Lion and the Jewel', 1963, (select id from authors where name = 'Wole Soyinka'));

insert into members (name, phone) values
  ('Grace Okafor', '0712345678'),
  ('Samuel Mensah', '0723456789'),
  ('Ruth Dlamini', '0734567890'),
  ('David Nkosi', null),
  ('Esther Bello', '0745678901');

insert into loans (book_id, member_id, due_on) values
  ((select id from books where title = 'Things Fall Apart'),
   (select id from members where name = 'Grace Okafor'),
   current_date + 14),
  ((select id from books where title = 'Americanah'),
   (select id from members where name = 'Samuel Mensah'),
   current_date + 14);