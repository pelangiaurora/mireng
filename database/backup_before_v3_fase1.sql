--
-- PostgreSQL database dump
--

\restrict Bs4IAXIXzNoy3linHoFZx4pBIOFgGnng9Xcqmgr0Eo31WXIT5qtEustVQqihB7G

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
-- Name: banners; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.banners (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200),
    image text NOT NULL,
    link text,
    "position" character varying(30) DEFAULT 'home'::character varying,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT banners_position_check CHECK ((("position")::text = ANY ((ARRAY['home'::character varying, 'category'::character varying, 'product'::character varying, 'popup'::character varying])::text[])))
);


ALTER TABLE public.banners OWNER TO mirenguser;

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
    slug text,
    parent_id uuid,
    icon text,
    image text,
    level integer DEFAULT 1,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO mirenguser;

--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.chat_messages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    chat_id uuid,
    sender_id uuid,
    message text,
    image text,
    product_id uuid,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chat_messages OWNER TO mirenguser;

--
-- Name: chats; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    buyer_id uuid,
    store_id uuid,
    last_message text,
    last_message_at timestamp without time zone DEFAULT now(),
    buyer_unread integer DEFAULT 0,
    seller_unread integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chats OWNER TO mirenguser;

--
-- Name: flash_sale_products; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.flash_sale_products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    flash_sale_id uuid,
    product_id uuid,
    discount_price bigint NOT NULL,
    quota integer NOT NULL,
    sold integer DEFAULT 0
);


ALTER TABLE public.flash_sale_products OWNER TO mirenguser;

--
-- Name: flash_sales; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.flash_sales (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(200),
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.flash_sales OWNER TO mirenguser;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(200) NOT NULL,
    message text,
    data jsonb,
    image text,
    action_url text,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.notifications OWNER TO mirenguser;

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
-- Name: order_stores; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.order_stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    store_id uuid,
    subtotal bigint DEFAULT 0 NOT NULL,
    shipping_fee bigint DEFAULT 0,
    courier character varying(50),
    courier_service character varying(50),
    tracking_number character varying(100),
    status character varying(30) DEFAULT 'pending'::character varying,
    notes text,
    seller_notes text,
    shipped_at timestamp without time zone,
    delivered_at timestamp without time zone,
    completed_at timestamp without time zone,
    cancelled_at timestamp without time zone,
    cancel_reason text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT order_stores_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'processing'::character varying, 'shipped'::character varying, 'delivered'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'refunded'::character varying])::text[])))
);


ALTER TABLE public.order_stores OWNER TO mirenguser;

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
    amount bigint,
    va_number character varying(50),
    payment_url text,
    expired_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now(),
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
-- Name: product_images; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.product_images (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid,
    url text NOT NULL,
    is_thumbnail boolean DEFAULT false,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.product_images OWNER TO mirenguser;

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
    price bigint,
    sku character varying(100),
    stock integer DEFAULT 0,
    image text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true
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
    store_id uuid,
    condition character varying(10) DEFAULT 'new'::character varying,
    weight integer DEFAULT 0,
    width integer DEFAULT 0,
    height integer DEFAULT 0,
    length integer DEFAULT 0,
    sku character varying(100),
    stock integer DEFAULT 0,
    min_order integer DEFAULT 1,
    is_digital boolean DEFAULT false,
    digital_file text,
    digital_note text,
    total_sold integer DEFAULT 0,
    rating numeric(3,2) DEFAULT 0,
    total_reviews integer DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now(),
    price numeric(12,2),
    "imageUrl" text,
    CONSTRAINT products_condition_check CHECK (((condition)::text = ANY ((ARRAY['new'::character varying, 'used'::character varying])::text[]))),
    CONSTRAINT products_type_check CHECK ((type = ANY (ARRAY['account'::text, 'file'::text, 'license'::text, 'physical'::text, 'digital'::text, 'service'::text])))
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
    store_id uuid,
    order_item_id uuid,
    images jsonb,
    is_anonymous boolean DEFAULT false,
    seller_reply text,
    replied_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO mirenguser;

--
-- Name: store_follows; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.store_follows (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    store_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.store_follows OWNER TO mirenguser;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    seller_id uuid,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    description text,
    logo text,
    banner text,
    city character varying(100),
    province character varying(100),
    district character varying(100),
    address text,
    postal_code character varying(10),
    phone character varying(20),
    operating_hours jsonb,
    holiday_mode boolean DEFAULT false,
    holiday_note text,
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    kyc_document text,
    rating numeric(3,2) DEFAULT 0,
    total_sales integer DEFAULT 0,
    total_reviews integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.stores OWNER TO mirenguser;

--
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.user_addresses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    label character varying(50) DEFAULT 'Rumah'::character varying,
    recipient_name character varying(100) NOT NULL,
    phone character varying(20) NOT NULL,
    address text NOT NULL,
    city character varying(100) NOT NULL,
    province character varying(100) NOT NULL,
    district character varying(100),
    postal_code character varying(10) NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    is_default boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.user_addresses OWNER TO mirenguser;

--
-- Name: users; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    name character varying,
    role character varying DEFAULT 'buyer'::character varying NOT NULL,
    phone character varying,
    avatar character varying,
    bio character varying,
    date_of_birth date,
    gender character varying,
    kyc_status character varying DEFAULT 'unverified'::character varying NOT NULL,
    kyc_document character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO mirenguser;

--
-- Name: voucher_usage; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.voucher_usage (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    voucher_id uuid,
    user_id uuid,
    order_id uuid,
    discount_amount bigint,
    used_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.voucher_usage OWNER TO mirenguser;

--
-- Name: vouchers; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.vouchers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    store_id uuid,
    code character varying(50) NOT NULL,
    title character varying(200),
    type character varying(20) DEFAULT 'discount'::character varying,
    value_type character varying(20) DEFAULT 'percentage'::character varying,
    value bigint NOT NULL,
    min_purchase bigint DEFAULT 0,
    max_discount bigint,
    quota integer DEFAULT 1,
    used_count integer DEFAULT 0,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT vouchers_type_check CHECK (((type)::text = ANY ((ARRAY['discount'::character varying, 'shipping'::character varying, 'cashback'::character varying])::text[]))),
    CONSTRAINT vouchers_value_type_check CHECK (((value_type)::text = ANY ((ARRAY['percentage'::character varying, 'fixed'::character varying])::text[])))
);


ALTER TABLE public.vouchers OWNER TO mirenguser;

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
-- Name: wishlists; Type: TABLE; Schema: public; Owner: mirenguser
--

CREATE TABLE public.wishlists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    product_id uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.wishlists OWNER TO mirenguser;

--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.banners (id, title, image, link, "position", sort_order, is_active, start_date, end_date, created_at) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.cart_items (id, quantity, "createdAt", "cartId", "productId") FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.carts (id, "createdAt", "userId") FROM stdin;
d3b6e556-ea29-4d32-8480-ebfaa1acee25	2026-05-22 20:16:04.568987	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.categories (id, name, slug, parent_id, icon, image, level, sort_order, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.chat_messages (id, chat_id, sender_id, message, image, product_id, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: chats; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.chats (id, buyer_id, store_id, last_message, last_message_at, buyer_unread, seller_unread, created_at) FROM stdin;
\.


--
-- Data for Name: flash_sale_products; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.flash_sale_products (id, flash_sale_id, product_id, discount_price, quota, sold) FROM stdin;
\.


--
-- Data for Name: flash_sales; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.flash_sales (id, title, start_time, end_time, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.notifications (id, user_id, type, title, message, data, image, action_url, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.order_items (id, quantity, price, "orderId", "productId") FROM stdin;
d3b3c73e-a72d-4e28-ae97-f7b8c17c04a8	1	25000	a79f5ec6-d678-46a1-b65b-842d54c6b39d	98559771-a86e-4ea0-8b79-abe807d6cc4b
\.


--
-- Data for Name: order_stores; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.order_stores (id, order_id, store_id, subtotal, shipping_fee, courier, courier_service, tracking_number, status, notes, seller_notes, shipped_at, delivered_at, completed_at, cancelled_at, cancel_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.orders (id, total, status, "createdAt", "userId") FROM stdin;
7e364754-2574-48ef-b754-788ee47940d5	25000	pending	2026-05-22 20:36:38.988756	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
4e91b98d-eee7-424a-bde3-d98e2e21c93b	25000	pending	2026-05-22 20:37:31.159887	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
c7a8833a-e292-457b-825d-277e41ec3832	25000	pending	2026-05-22 20:37:46.928592	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
17ca401e-3732-4a91-b3db-1796b9aedd10	25000	pending	2026-05-22 20:38:33.86085	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
a79f5ec6-d678-46a1-b65b-842d54c6b39d	25000	pending	2026-05-22 20:42:01.406969	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.payments (id, order_id, method, external_id, status, paid_at, created_at, amount, va_number, payment_url, expired_at, updated_at) FROM stdin;
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
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_images (id, product_id, url, is_thumbnail, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: product_stocks; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_stocks (id, product_id, variant_id, data, is_used, used_at) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.product_variants (id, product_id, name, price, sku, stock, image, sort_order, is_active) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.products (id, seller_id, category_id, name, slug, description, type, base_price, is_active, created_at, store_id, condition, weight, width, height, length, sku, stock, min_order, is_digital, digital_file, digital_note, total_sold, rating, total_reviews, updated_at, price, "imageUrl") FROM stdin;
98559771-a86e-4ea0-8b79-abe807d6cc4b	2e293f5a-cb3d-4061-b6c5-8e47b7b89e72	\N	Akun Premium Netflix 1 Bulan	akun-premium-netflix-1-bulan-1779455719016	Akun premium digital untuk testing marketplace.	account	25000	t	2026-05-22 20:15:19.019416	\N	new	0	0	0	0	\N	0	1	f	\N	\N	0	0.00	0	2026-05-22 20:15:19.019416	25000.00	\N
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.reviews (id, product_id, user_id, rating, comment, created_at, store_id, order_item_id, images, is_anonymous, seller_reply, replied_at, updated_at) FROM stdin;
\.


--
-- Data for Name: store_follows; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.store_follows (id, user_id, store_id, created_at) FROM stdin;
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.stores (id, seller_id, name, slug, description, logo, banner, city, province, district, address, postal_code, phone, operating_hours, holiday_mode, holiday_note, is_active, is_verified, kyc_document, rating, total_sales, total_reviews, created_at, updated_at) FROM stdin;
616012eb-d0ee-47c8-903a-a8cf5cec9f85	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0	Amanah	amanah	Menjual semua produk digital	\N	\N	Surabaya	Jawa Timur	Sukamaju	Jl. Berkah Jaya	60123	081234567890	\N	f	\N	t	f	\N	0.00	0	0	2026-05-24 16:08:54.164845	2026-05-24 16:08:54.164845
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.user_addresses (id, user_id, label, recipient_name, phone, address, city, province, district, postal_code, latitude, longitude, is_default, created_at, updated_at) FROM stdin;
0da1b59a-10c8-4367-aa67-da2b4fedda4d	2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0	Rumah	Zyan	081234567890	Jl. Madinah	Surabaya	Jawa Timur	Sukajaya	60123	\N	\N	t	2026-05-22 13:13:07.369968	2026-05-22 13:13:07.369968
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.users (id, email, password, name, role, phone, avatar, bio, date_of_birth, gender, kyc_status, kyc_document, is_active, created_at, updated_at) FROM stdin;
2a0ffa5e-f5c3-4bd2-8b1c-06e34bfea6c0	seller2@mireng.com	$2b$10$CVfb55fmU4K/7JvhQtxwi.38pycqTUkvDFxPtA1ZWBfIQ3O8/0jGC	Seller 2	seller	\N	\N	\N	\N	\N	unverified	\N	t	2026-05-21 03:37:36.485685	2026-05-21 03:37:36.485685
2e293f5a-cb3d-4061-b6c5-8e47b7b89e72	buyer@example.com	$2b$10$MZROByvVaUOWhkv4KFicgePp9t59ebPItsyls1b7WZa8H44Dg1jem	Ahlam Buyer	seller	\N	\N	\N	\N	\N	unverified	\N	t	2026-05-22 19:41:47.11169	2026-05-22 19:49:18.133427
\.


--
-- Data for Name: voucher_usage; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.voucher_usage (id, voucher_id, user_id, order_id, discount_amount, used_at) FROM stdin;
\.


--
-- Data for Name: vouchers; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.vouchers (id, store_id, code, title, type, value_type, value, min_purchase, max_discount, quota, used_count, start_date, end_date, is_active, created_at) FROM stdin;
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
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: mirenguser
--

COPY public.wishlists (id, user_id, product_id, created_at) FROM stdin;
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
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


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
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- Name: chats chats_buyer_id_store_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_buyer_id_store_id_key UNIQUE (buyer_id, store_id);


--
-- Name: chats chats_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_pkey PRIMARY KEY (id);


--
-- Name: flash_sale_products flash_sale_products_flash_sale_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.flash_sale_products
    ADD CONSTRAINT flash_sale_products_flash_sale_id_product_id_key UNIQUE (flash_sale_id, product_id);


--
-- Name: flash_sale_products flash_sale_products_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.flash_sale_products
    ADD CONSTRAINT flash_sale_products_pkey PRIMARY KEY (id);


--
-- Name: flash_sales flash_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.flash_sales
    ADD CONSTRAINT flash_sales_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_stores order_stores_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_stores
    ADD CONSTRAINT order_stores_pkey PRIMARY KEY (id);


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
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


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
-- Name: store_follows store_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.store_follows
    ADD CONSTRAINT store_follows_pkey PRIMARY KEY (id);


--
-- Name: store_follows store_follows_user_id_store_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.store_follows
    ADD CONSTRAINT store_follows_user_id_store_id_key UNIQUE (user_id, store_id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: stores stores_seller_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_seller_id_key UNIQUE (seller_id);


--
-- Name: stores stores_slug_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_slug_key UNIQUE (slug);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: voucher_usage voucher_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.voucher_usage
    ADD CONSTRAINT voucher_usage_pkey PRIMARY KEY (id);


--
-- Name: vouchers vouchers_code_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_code_key UNIQUE (code);


--
-- Name: vouchers vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_pkey PRIMARY KEY (id);


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
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: idx_categories_par; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_categories_par ON public.categories USING btree (parent_id);


--
-- Name: idx_chat_msg_chat; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_chat_msg_chat ON public.chat_messages USING btree (chat_id);


--
-- Name: idx_chats_buyer; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_chats_buyer ON public.chats USING btree (buyer_id);


--
-- Name: idx_chats_store; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_chats_store ON public.chats USING btree (store_id);


--
-- Name: idx_notif_read; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_notif_read ON public.notifications USING btree (is_read);


--
-- Name: idx_notif_user; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_notif_user ON public.notifications USING btree (user_id);


--
-- Name: idx_os_order; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_os_order ON public.order_stores USING btree (order_id);


--
-- Name: idx_os_status; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_os_status ON public.order_stores USING btree (status);


--
-- Name: idx_os_store; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_os_store ON public.order_stores USING btree (store_id);


--
-- Name: idx_pimg_product; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_pimg_product ON public.product_images USING btree (product_id);


--
-- Name: idx_products_active; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_active ON public.products USING btree (is_active);


--
-- Name: idx_products_cat; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_cat ON public.products USING btree (category_id);


--
-- Name: idx_products_seller; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_seller ON public.products USING btree (seller_id);


--
-- Name: idx_products_store; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_store ON public.products USING btree (store_id);


--
-- Name: idx_products_type; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_products_type ON public.products USING btree (type);


--
-- Name: idx_reviews_product; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_reviews_product ON public.reviews USING btree (product_id);


--
-- Name: idx_reviews_store; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_reviews_store ON public.reviews USING btree (store_id);


--
-- Name: idx_stock_product; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_stock_product ON public.product_stocks USING btree (product_id);


--
-- Name: idx_stores_city; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_stores_city ON public.stores USING btree (city);


--
-- Name: idx_stores_seller; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_stores_seller ON public.stores USING btree (seller_id);


--
-- Name: idx_stores_slug; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_stores_slug ON public.stores USING btree (slug);


--
-- Name: idx_ua_user; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_ua_user ON public.user_addresses USING btree (user_id);


--
-- Name: idx_wl_user; Type: INDEX; Schema: public; Owner: mirenguser
--

CREATE INDEX idx_wl_user ON public.wishlists USING btree (user_id);


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
-- Name: product FK_d5cac481d22dacaf4d53f900a3f; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f" FOREIGN KEY ("sellerId") REFERENCES public.users(id);


--
-- Name: cart_items cart_items_cartid_carts_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cartid_carts_id_fk FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_productid_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_productid_products_id_fk FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id);


--
-- Name: chat_messages chat_messages_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chats(id) ON DELETE CASCADE;


--
-- Name: chat_messages chat_messages_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: chat_messages chat_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: chats chats_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chats chats_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.chats
    ADD CONSTRAINT chats_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: flash_sale_products flash_sale_products_flash_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.flash_sale_products
    ADD CONSTRAINT flash_sale_products_flash_sale_id_fkey FOREIGN KEY (flash_sale_id) REFERENCES public.flash_sales(id) ON DELETE CASCADE;


--
-- Name: flash_sale_products flash_sale_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.flash_sale_products
    ADD CONSTRAINT flash_sale_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_orderid_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_orderid_orders_id_fk FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_productid_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_productid_products_id_fk FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: order_stores order_stores_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_stores
    ADD CONSTRAINT order_stores_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_stores order_stores_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.order_stores
    ADD CONSTRAINT order_stores_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


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
-- Name: products products_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- Name: reviews reviews_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: reviews reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reviews reviews_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: store_follows store_follows_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.store_follows
    ADD CONSTRAINT store_follows_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: store_follows store_follows_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.store_follows
    ADD CONSTRAINT store_follows_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: stores stores_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_addresses user_addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: voucher_usage voucher_usage_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.voucher_usage
    ADD CONSTRAINT voucher_usage_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: voucher_usage voucher_usage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.voucher_usage
    ADD CONSTRAINT voucher_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: voucher_usage voucher_usage_voucher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.voucher_usage
    ADD CONSTRAINT voucher_usage_voucher_id_fkey FOREIGN KEY (voucher_id) REFERENCES public.vouchers(id);


--
-- Name: vouchers vouchers_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.vouchers
    ADD CONSTRAINT vouchers_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id);


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
-- Name: wishlists wishlists_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: mirenguser
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Bs4IAXIXzNoy3linHoFZx4pBIOFgGnng9Xcqmgr0Eo31WXIT5qtEustVQqihB7G

