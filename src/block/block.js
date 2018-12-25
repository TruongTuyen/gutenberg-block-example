(function(wp) {
	const { registerBlockType } = wp.blocks;
	const { el } = wp.element.createElement;
	const { __ } = wp.i18n;
	const { withSelect } = wp.data;
	const { Component, Fragment } = wp.element;
	const { pickBy, isUndefined } = lodash;
	const {
		InspectorControls,
		ColorPalette,
		PanelColorSettings,
		ContrastChecker,
		BlockControls
	} = wp.editor;
	const {
		CheckboxControl,
		PanelBody,
		QueryControls,
		PanelRow,
		RadioControl,
		RangeControl,
		TextControl,
		TextareaControl,
		ToggleControl,
		SelectControl,
		Toolbar
	} = wp.components;
	

	class AdvancePostsEdit extends Component {
		constructor() {
			super(...arguments);
			this.state = {
				updating: false
			};
		}

		static extractContent(html, length) {
			const span = document.createElement("span");
			span.innerHTML = html;

			// Remove script tag
			const scripts = span.getElementsByTagName("script");
			let j = scripts.length;
			while (j--) {
				scripts[j].parentNode.removeChild(scripts[j]);
			}

			// Remove style tag
			const styles = span.getElementsByTagName("style");
			let k = styles.length;
			while (k--) {
				styles[k].parentNode.removeChild(styles[k]);
			}

			const children = span.querySelectorAll("*");
			for (let i = 0; i < children.length; i++) {
				if (children[i].textContent) children[i].textContent += " ";
				else children[i].innerText += " ";
			}

			let text = [span.textContent || span.innerText]
				.toString()
				.replace(/\s\s+/g, " ");
			text = text.slice(0, length).trim();

			if (text.length) text += "…";

			return text;
		}

		render() {
			const {
				attributes,
				setAttributes,
				advancePosts,
				cateLists
			} = this.props;

			const {
				isEnableThumbnail,
				postTitleColor,
				postExcerptColor,
				numberPosts,
				order,
				orderBy,
				category,
				postLayout,
				excerptLength,
				showAuthor,
				showDate,
				showCommentCount
			} = attributes;
			const layoutControls = [
				{
					icon: "list-view",
					title: __("List View"),
					onClick: () => setAttributes({ postLayout: "list" }),
					isActive: postLayout === "list" || 'undefined' === typeof postLayout
				},
				{
					icon: "grid-view",
					title: __("Grid View"),
					onClick: () => setAttributes({ postLayout: "grid" }),
					isActive: postLayout === "grid"
				}
			];

			const inspectorControls = (
				<InspectorControls>
					<PanelBody title={__("Posts settings")} initialOpen={true}>
						<QueryControls
							{...{ order, orderBy }}
							categoriesList={cateLists}
							selectedCategoryId={category}
							numberOfItems={numberPosts}
							onOrderChange={value =>
								setAttributes({ order: value })
							}
							onOrderByChange={value =>
								setAttributes({ orderBy: value })
							}
							onCategoryChange={value =>
								setAttributes({
									category: value !== "" ? value : undefined
								})
							}
							onNumberOfItemsChange={value =>
								setAttributes({ numberPosts: value })
							}
						/>
						<RangeControl
							beforeIcon="arrow-left-alt2"
							afterIcon="arrow-right-alt2"
							label={__("Excerpt Length")}
							value={excerptLength}
							onChange={excerptLength =>
								setAttributes({ excerptLength })
							}
							min={-1}
						/>
						<ToggleControl
							label={__("Show post thumbnail")}
							checked={isEnableThumbnail}
							onChange={isEnableThumbnail =>
								setAttributes({ isEnableThumbnail })
							}
						/>
						<ToggleControl
                            label={ __( 'Show author' ) }
                            checked={ showAuthor }
                            onChange={ () => setAttributes( { showAuthor: !showAuthor } ) }
                        />
						<ToggleControl
                            label={ __( 'Show date time' ) }
                            checked={ showDate }
                            onChange={ () => setAttributes( { showDate: !showDate } ) }
                        />
						<ToggleControl
                            label={ __( 'Show comment count' ) }
                            checked={ showCommentCount }
                            onChange={ () => setAttributes( { showCommentCount: !showCommentCount } ) }
                        />

						<PanelColorSettings
							title={__("Post title color")}
							colorSettings={[
								{
									value: postTitleColor,
									onChange: postTitleColor => {
										setAttributes({ postTitleColor });
									},
									label: __("Title color")
								}
							]}
						/>
						<PanelColorSettings
							title={__("Post excerpt color")}
							colorSettings={[
								{
									value: postExcerptColor,
									onChange: postExcerptColor => {
										setAttributes({ postExcerptColor });
									},
									label: __("Excerpt color")
								}
							]}
						/>
					</PanelBody>
				</InspectorControls>
			);

			var render_html;
			if (Array.isArray(advancePosts)) {
				render_html = advancePosts.map((post, index) => (
					<div className="post--item_wrap">
						{isEnableThumbnail && post.featured_img && (
							<div className="post--item_thumbnail">
								<a href={post.link} title={post.title.rendered}>
									<img
										src={post.featured_img}
										alt={post.title.rendered}
									/>
								</a>
							</div>
						)}
						
						<div className="post--item_info">
							<h4 class="post--item_title">
								<a href={post.link} title={post.title.rendered} style={{color:postTitleColor}}>
									{post.title.rendered.trim() || __( '(Untitled)' )}
								</a>
							</h4>
							<div className="post--item_meta">
								{ showAuthor && (
									<span className="post--item_meta__author">
										<a href={post.author_meta.author_link} className="post--item_meta__author_link">{post.author_meta.display_name}</a>
									</span>
								)}

								{ showDate && (
									<span className="post--item_meta__date">{ moment( post.date_gmt ).local().format( 'MMMM DD, Y' ) }</span>
								)}

							</div>
							<div
								className="post--item_excerpt"
								dangerouslySetInnerHTML={{
									__html: AdvancePostsEdit.extractContent( post.content.rendered, 20 )
								}}
								style={{color:postExcerptColor}}
							/>
						</div>
					</div>
				));
			} else {
				render_html = <p className="no-post-found">No post found</p>;
			}

			var block_post_layout = 'advance-posts list-view';
			if( 'grid' === postLayout ) {
				block_post_layout = 'advance-posts grid-view';
			}
			return (
				<Fragment>
					{inspectorControls}
					<BlockControls>
						<Toolbar controls={layoutControls} />
					</BlockControls>
					<div className={block_post_layout}>{render_html}</div>
				</Fragment>
			);
		}
	}

	registerBlockType("block-posts/advance-posts", {
		title: __("Advance Posts"),
		description: __("Advance blog posts."),
		category: "common",
		keywords: [__("posts list"), __("posts slide"), __("posts grid")],
		attributes: {
			numberPosts: {
				type: "integer",
				default: 5
			},
			excerptLength: {
				type: "integer",
				default: 30
			},
			postTitleColor: {
				type: "string",
				default: "#000"
			},
			postExcerptColor: {
				type: "string",
				default: "#000"
			},
			isEnableThumbnail: {
				type: "boolean",
				default: true
			},
			showAuthor: {
				type: "boolean",
				default: true
			},
			showDate: {
				type: "boolean",
				default: true
			},
			showCommentCount: {
				type: "boolean",
				default: true
			},
			order: {
				type: "string",
				default: "ASC"
			},
			orderBy: {
				type: "string",
				default: "date"
			},
			postLayout: {
				type: "string",
				default: "list"
			},
			category: {
				type: "string"
			}
		},
		edit: withSelect((select, props) => {
			const { getEntityRecords } = select("core");
			const {
				isEnableThumbnail,
				postTitleColor,
				postExcerptColor,
				numberPosts,
				order,
				orderBy,
				category,
				postLayout,
				excerptLength,
				showAuthor,
				showDate,
				showCommentCount
			} = props.attributes;
			const advancePostsQuery = pickBy(
				{
					categories: category,
					order,
					orderby: orderBy,
					per_page: numberPosts
				},
				value => !isUndefined(value)
			);

			const categoriesListQuery = {
				per_page: 99
			};

			return {
				advancePosts: getEntityRecords(
					"postType",
					"post",
					advancePostsQuery
				),
				cateLists: getEntityRecords(
					"taxonomy",
					"category",
					categoriesListQuery
				)
			};
		})(AdvancePostsEdit),
		save: function() {
			return null;
		}
	});
})(window.wp);
