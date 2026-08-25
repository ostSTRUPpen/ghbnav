-- Deterministic data for browser tests. This is loaded only into postgres-test.
INSERT INTO icons (id, display_name, image, position)
VALUES
	('ostatni', 'Ostatní', 'ostatni', 1),
	('testovaci', 'Testovací skupina', 'ostatni', 2);

INSERT INTO markers (
	id,
	x,
	y,
	display_name,
	floor,
	icon,
	can_nav,
	building_location
)
VALUES
	(
		'11111111-1111-4111-8111-111111111111',
		1000,
		1000,
		'Testovací vstup',
		1,
		'ostatni',
		true,
		'nova'
	),
	(
		'22222222-2222-4222-8222-222222222222',
		2000,
		2000,
		'Testovací cíl',
		1,
		'ostatni',
		true,
		'nova'
	),
	(
		'33333333-3333-4333-8333-333333333333',
		1500,
		1500,
		'Zakázaný testovací bod',
		1,
		'ostatni',
		false,
		'nova'
	);

INSERT INTO nav_markers (id, x, y, floor, connected, special_type, name)
VALUES
	(
		1,
		1100,
		1100,
		1,
		'{"2": 1, "11111111-1111-4111-8111-111111111111": 1}'::json,
		NULL,
		'test-start'
	),
	(
		2,
		1900,
		1900,
		1,
		'{"1": 1, "22222222-2222-4222-8222-222222222222": 1}'::json,
		NULL,
		'test-end'
	);

INSERT INTO preset_paths (id, start_node, end_node, hidden, position)
VALUES (
	1,
	'11111111-1111-4111-8111-111111111111',
	'22222222-2222-4222-8222-222222222222',
	false,
	1
);

-- test@t.t / test; never use this account outside the isolated test database.
INSERT INTO users (email, password, note)
VALUES (
	'dGVzdEB0LnQ=',
	'$2b$10$iIuxIWTIanbRjdr8bTsHfuf17LV2y9Ra6uSdprhRfSl0kOJ7E5yAm',
	'Automatizované testy'
);
