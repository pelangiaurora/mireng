--
-- PostgreSQL database dump
--

\restrict VCod7cbQWP7CHQ93zX8Axpfuj3CMwXD9x0Q7hdKFXX0pb1EbwZg4QCZckovK4W6

-- Dumped from database version 17.10 (Debian 17.10-0+deb13u1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: mirenguser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO mirenguser;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "cartId" uuid,
    "productId" uuid
);


ALTER TABLE public.cart_items OWNER TO mirenguser;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.carts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


ALTER TABLE public.carts OWNER TO mirenguser;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.categories (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text,
    slug text
);


ALTER TABLE public.categories OWNER TO mirenguser;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.order_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    "orderId" uuid,
    "productId" uuid
);


ALTER TABLE public.order_items OWNER TO mirenguser;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    total numeric DEFAULT '0'::numeric NOT NULL,
    status character varying DEFAULT 'pending'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid
);


ALTER TABLE public.orders OWNER TO mirenguser;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    method text,
    external_id text,
    status text DEFAULT 'pending'::text,
    paid_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT payments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'expired'::text, 'failed'::text])))
);


ALTER TABLE public.payments OWNER TO mirenguser;

--
-- Name: product; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    price numeric(12,2) NOT NULL,
    "imageUrl" character varying,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "sellerId" uuid
);


ALTER TABLE public.product OWNER TO mirenguser;

--
-- Name: product_image; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.product_image (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "imageUrl" character varying NOT NULL,
    "isThumbnail" boolean DEFAULT false NOT NULL,
    "productId" uuid
);


ALTER TABLE public.product_image OWNER TO mirenguser;

--
-- Name: product_stocks; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.product_stocks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    variant_id uuid,
    data jsonb,
    is_used boolean DEFAULT false,
    used_at timestamp without time zone
);


ALTER TABLE public.product_stocks OWNER TO mirenguser;

--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.product_variants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    name text,
    price bigint
);


ALTER TABLE public.product_variants OWNER TO mirenguser;

--
-- Name: products; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    seller_id uuid,
    category_id uuid,
    name text NOT NULL,
    slug text,
    description text,
    type text,
    base_price bigint,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT products_type_check CHECK ((type = ANY (ARRAY['account'::text, 'file'::text, 'license'::text])))
);


ALTER TABLE public.products OWNER TO mirenguser;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    user_id uuid,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO mirenguser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying,
    role character varying DEFAULT 'buyer'::character varying NOT NULL
);


ALTER TABLE public.users OWNER TO mirenguser;

--
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.wallet_transactions (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    wallet_id uuid,
    type text,
    amount bigint,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT wallet_transactions_type_check CHECK ((type = ANY (ARRAY['credit'::text, 'debit'::text])))
);


ALTER TABLE public.wallet_transactions OWNER TO mirenguser;

--
-- Name: wallets; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.wallets (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    balance bigint DEFAULT 0
);


ALTER TABLE public.wallets OWNER TO mirenguser;

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.cart_items (id, quantity, "createdAt", "cartId", "productId") FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.carts (id, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.categories (id, name, slug) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.order_items (id, quantity, price, "orderId", "productId") FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.orders (id, total, status, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.payments (id, order_id, method, external_id, status, paid_at, created_at) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product (id, name, description, price, "imageUrl", "isActive", "createdAt", "sellerId") FROM stdin;
\.


--
-- Data for Name: product_image; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_image (id, "imageUrl", "isThumbnail", "productId") FROM stdin;
\.


--
-- Data for Name: product_stocks; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_stocks (id, product_id, variant_id, data, is_used, used_at) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_variants (id, product_id, name, price) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.products (id, seller_id, category_id, name, slug, description, type, base_price, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.reviews (id, product_id, user_id, rating, comment, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.users (id, email, password, name, role) FROM stdin;
2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0	seller2@mireng.com	$2b$10$CVfb55fmU4K/7JvhQtxwi.38pycqTUkvDFxPtA1ZWBfIQ3O8/0jGC	Seller 2	seller
\.


--
-- Data for Name: wallet_transactions; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.wallet_transactions (id, wallet_id, type, amount, description, created_at) FROM stdin;
\.


--
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.wallets (id, user_id, balance) FROM stdin;
\.


--
-- Name: order_items PK_005269d8574e6fac0493715c308; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY (id);


--
-- Name: cart_items PK_6fccf5ec03c172d27a28a82928b; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: product_image PK_99d98a80f57857d51b5f63c8240; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: carts PK_b5f695a59f5ebb50af3c8160816; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY (id);


--
-- Name: product PK_bebc9158e480b949565b4dc7a82; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: payments payments_order_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_key UNIQUE (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: product_stocks product_stocks_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_slug_key UNIQUE (slug);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: wallet_transactions wallet_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- Name: wallets wallets_user_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_key UNIQUE (user_id);


--
-- Name: idx_products_seller; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_seller ON public.products USING btree (seller_id);


--
-- Name: idx_stock_product; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_stock_product ON public.product_stocks USING btree (product_id);


--
-- Name: orders FK_151b79a83ba240b0cb31b2302d1; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: product_image FK_40ca0cd115ef1ff35351bed8da2; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES public.product(id) ON DELETE CASCADE;


--
-- Name: carts FK_69828a178f152f157dcf2f70a89; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: cart_items FK_72679d98b31c737937b8932ebe6; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.product(id);


--
-- Name: order_items FK_cdb99c05982d5191ac8465ac010; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId") REFERENCES public.product(id);


--
-- Name: product FK_d5cac481d22dacaf4d53f900a3f; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f" FOREIGN KEY ("sellerId") REFERENCES public.users(id);


--
-- Name: cart_items FK_edd714311619a5ad09525045838; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES public.carts(id);


--
-- Name: order_items FK_f1d359a55923bb45b057fbdab0d; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "FK_f1d359a55923bb45b057fbdab0d" FOREIGN KEY ("orderId") REFERENCES public.orders(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: product_stocks product_stocks_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_stocks product_stocks_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_stocks
    ADD CONSTRAINT product_stocks_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES public.product_variants(id);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products products_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: wallet_transactions wallet_transactions_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.wallets(id);


--
-- Name: wallets wallets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict VCod7cbQWP7CHQ93zX8Axpfuj3CMwXD9x0Q7hdKFXX0pb1EbwZg4QCZckovK4W6

