DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type') THEN
    CREATE TYPE user_type AS ENUM ('organizador','donador');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donation_status') THEN
    CREATE TYPE donation_status AS ENUM ('pendiente','pagada','fallida','reembolsada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transfer_status') THEN
    CREATE TYPE transfer_status AS ENUM ('programada','en_proceso','liquidada','fallida');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'owner_kind') THEN
    CREATE TYPE owner_kind AS ENUM ('evento','organizacion');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS usuario (
  id            BIGSERIAL PRIMARY KEY,
  tipo          user_type NOT NULL,
  nombre        TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  payment_pointer TEXT
);

CREATE TABLE IF NOT EXISTS area (
  id     BIGSERIAL PRIMARY KEY,
  nombre TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS organizacion (
  id         BIGSERIAL PRIMARY KEY,
  area_id    BIGINT REFERENCES area(id),
  nombre     TEXT NOT NULL,
  verificada BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS evento (
  id             BIGSERIAL PRIMARY KEY,
  organizador_id BIGINT NOT NULL REFERENCES usuario(id),
  area_id        BIGINT REFERENCES area(id),
  titulo         TEXT NOT NULL,
  descripcion    TEXT,
  start_at       TIMESTAMPTZ NOT NULL,
  end_at         TIMESTAMPTZ NOT NULL,
  moneda         CHAR(3) NOT NULL DEFAULT 'MXN',
  CONSTRAINT chk_evento_duracion CHECK (end_at > start_at)
);

CREATE TABLE IF NOT EXISTS evento_organizacion (
  evento_id       BIGINT NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
  organizacion_id BIGINT NOT NULL REFERENCES organizacion(id),
  porcentaje      NUMERIC(5,2) NOT NULL CHECK (porcentaje >= 0 AND porcentaje <= 100),
  PRIMARY KEY (evento_id, organizacion_id)
);

CREATE TABLE IF NOT EXISTS donacion (
  id              BIGSERIAL PRIMARY KEY,
  id_usuario      BIGINT REFERENCES usuario(id),      
  id_evento       BIGINT NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
  monto           NUMERIC(14,2) NOT NULL CHECK (monto > 0),
  moneda          CHAR(3) NOT NULL DEFAULT 'MXN',
  estado          donation_status NOT NULL DEFAULT 'pendiente',
  -- Metadatos Open Payments
  llave_remitente TEXT,           -- opcional: payment pointer emisor
  llave_receptora TEXT,           -- opcional: payment pointer del evento
  op_quote_id     TEXT,
  op_invoice_id   TEXT,
  op_incoming_id  TEXT,
  op_raw          JSONB,
  -- timestamps mínimos para trazabilidad
  creado_en       TIMESTAMPTZ DEFAULT now(),
  pagada_en       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transferencia (
  id               BIGSERIAL PRIMARY KEY,
  evento_id        BIGINT NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
  organizacion_id  BIGINT NOT NULL REFERENCES organizacion(id),
  monto            NUMERIC(14,2) NOT NULL CHECK (monto > 0),
  moneda           CHAR(3) NOT NULL DEFAULT 'MXN',
  estado           transfer_status NOT NULL DEFAULT 'programada',
  op_payment_id    TEXT,
  op_quote_id      TEXT,
  op_raw           JSONB,
  programada_en    TIMESTAMPTZ DEFAULT now(),
  liquidada_en     TIMESTAMPTZ
);


INSERT INTO area (nombre) VALUES
  ('Derechos humanos'),                     --1
  ('Protección del medio ambiente'),        --2
  ('Asistencia médica'),                    --3
  ('Educación'),                            --4
  ('Ayuda humanitaria'),                    --5
  ('Desarrollo económico')                  --6
ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 1. Derechos humanos
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Derechos humanos'),
        'Comisión Mexicana de Defensa y Promoción de los Derechos Humanos (CMDPDH)', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Derechos humanos'),
        'Liga Mexicana por la Defensa de los Derechos Humanos (LIMEDDH)', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Derechos humanos'),
        'Centro de Derechos Humanos de la Montaña Tlachinollan', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Derechos humanos'),
        'Amnistía Internacional México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Derechos humanos'),
        'Peace Brigades International (PBI) México', TRUE);


-- 2. Protección del medio ambiente
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Protección del medio ambiente'),
        'WWF México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Protección del medio ambiente'),
        'Centro Mexicano de Derecho Ambiental (CEMDA)', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Protección del medio ambiente'),
        'Naturalia A.C.', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Protección del medio ambiente'),
        'GRUPEDSAC (Grupo para Promover la Educación y el Desarrollo Sustentable)', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Protección del medio ambiente'),
        'OEAAC (Organización de Educación Ambiental A.C.)', TRUE);


-- 3. Asistencia médica
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Asistencia médica'),
        'Médicos Sin Fronteras México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Asistencia médica'),
        'Cruz Roja Mexicana', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Asistencia médica'),
        'Fundación IMSS', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Asistencia médica'),
        'Fundación Médica A.C.', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Asistencia médica'),
        'AHF México (Fundación de lucha contra el VIH/SIDA)', TRUE);


-- 4. Educación
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Educación'),
        'CESAL México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Educación'),
        'Fundación para la Educación', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Educación'),
        'Educare México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Educación'),
        'Enseña por México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Educación'),
        'Fundación Telefónica México', TRUE);


-- 5. Ayuda humanitaria
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Ayuda humanitaria'),
        'Ayuda en Acción México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Ayuda humanitaria'),
        'Cruz Roja Mexicana', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Ayuda humanitaria'),
        'Médicos Sin Fronteras México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Ayuda humanitaria'),
        'Brigadas de Rescate Topos Tlatelolco', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Ayuda humanitaria'),
        'CARE México', TRUE);


-- 6. Desarrollo económico
INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Desarrollo económico'),
        'CESAL México (programas de desarrollo económico)', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Desarrollo económico'),
        'Fundación ProEmpleo Productivo', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Desarrollo económico'),
        'Fondo Unido México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Desarrollo económico'),
        'Fundación Avina México', TRUE);

INSERT INTO organizacion (area_id, nombre, verificada)
VALUES ((SELECT id FROM area WHERE nombre = 'Desarrollo económico'),
        'Ashoka México', TRUE);

-- Índices útiles (lecturas más rápidas)
CREATE INDEX IF NOT EXISTS idx_evento_organizador ON evento(organizador_id);
CREATE INDEX IF NOT EXISTS idx_evento_time ON evento(start_at, end_at);
CREATE INDEX IF NOT EXISTS idx_donacion_evento ON donacion(id_evento);
CREATE INDEX IF NOT EXISTS idx_donacion_estado ON donacion(estado);
CREATE INDEX IF NOT EXISTS idx_transfer_evento_org ON transferencia(evento_id, organizacion_id);
CREATE INDEX IF NOT EXISTS idx_transfer_estado ON transferencia(estado);
SELECT * 
FROM evento;
INSERT INTO usuario (id, tipo, nombre, password_hash)
VALUES (1, 'organizador', 'organizador_prueba', 'hash_de_prueba');