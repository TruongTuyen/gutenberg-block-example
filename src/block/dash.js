(function(wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var el = wp.element.createElement;
	var __ = wp.i18n.__;
	var Component,
		Fragment = wp.element;
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
		PanelRow,
		RadioControl,
		RangeControl,
		TextControl,
		TextareaControl,
		ToggleControl,
		SelectControl,
		Toolbar
	} = wp.components;
	const { withSelect } = wp.data;

	class AdvanceBlockPosts extends Component {
		constructorabc () {
			//super( ...arguments );
			this.state = {
				updating: false
			}
		}

		componentWillUpdate( nextProps ) {

		}

		componentDidUpdate( prevProps ) {

		}

		render () {
			const { attributes, setAttributes, blockPosts, cate_lists } = this.props;
			const { 
				isEnableThumbnail,
				postTitleColor,
				postExcerptColor,
				numberPosts,
				order,
				orderBy,
				postLayout
			} = $attributes;

			const layoutControls = [
				{
					icon: "list-view",
					title: __("List View"),
					onClick: () => setAttributes({ postLayout: "list" }),
					isActive: postLayout === "list"
				},
				{
					icon: "grid-view",
					title: __("Grid View"),
					onClick: () => setAttributes({ postLayout: "grid" }),
					isActive: postLayout === "grid"
				}
			];

			const InspectorControls = (
				<InspectorControls>
					<PanelBody title={__("Posts settings")} initialOpen={true}>
						<QueryControls
                            { ...{ order, orderBy } }
                            categoriesList={ cate_lists }
                            selectedCategoryId={ category }
                            numberOfItems={ numberOfPosts }
                            onOrderChange={ ( value ) => setAttributes( { order: value } ) }
                            onOrderByChange={ ( value ) => setAttributes( { orderBy: value } ) }
                            onCategoryChange={ ( value ) => setAttributes( { category: value !== '' ? value : undefined } ) }
                            onNumberOfItemsChange={ (value) => setAttributes( { numberOfPosts: value } ) }
                        />
						<RangeControl
							beforeIcon="arrow-left-alt2"
							afterIcon="arrow-right-alt2"
							label={__("Number Posts")}
							value={numberPosts}
							onChange={numberPosts =>
								setAttributes({ numberPosts })
							}
							min={-1}
						/>
						<SelectControl
							label={__("Order")}
							value={order}
							options={[
								{ value: "ASC", label: __("ASC") },
								{ value: "DESC", label: __("DESC") }
							]}
							onChange={order => setAttributes({ order })}
						/>
						<SelectControl
							label={__("Order By")}
							value={orderBy}
							options={[
								{ value: "date", label: __("Date") },
								{ value: "ID", label: __("ID") },
								{ value: "author", label: __("Author") },
								{ value: "title", label: __("Title") },
								{ value: "rand", label: __("Random") },
								{
									value: "comment_count",
									label: __("Comment Count")
								},
								{ value: "name", label: __("Name") }
							]}
							onChange={orderBy => setAttributes({ orderBy })}
						/>
						<CheckboxControl
							heading={__("Post thumbnail")}
							label={__("Enable post thumbnail")}
							checked={isEnableThumbnail}
							onChange={isEnableThumbnail =>
								setAttributes({ isEnableThumbnail })
							}
						/>

						<PanelColorSettings
							title={__("Post Title Color", "jsforwpblocks")}
							colorSettings={[
								{
									value: postTitleColor,
									onChange: postTitleColor => {
										setAttributes({ postTitleColor });
									},
									label: __("Title Color")
								}
							]}
						/>
						<PanelColorSettings
							title={__("Post Excerpt Color", "jsforwpblocks")}
							colorSettings={[
								{
									value: postExcerptColor,
									onChange: postExcerptColor => {
										setAttributes({ postExcerptColor });
									},
									label: __("Excerpt Color")
								}
							]}
						/>
					</PanelBody>
				</InspectorControls>
			);

			return [
				InspectorControls,
				<BlockControls>
					<Toolbar controls={layoutControls} />
				</BlockControls>,

				<div className="abc">Block Posts</div>
			];
		}
	}

	registerBlockType("block-posts/block-posts", {
		title: __("Posts block"),
		category: "common",
		keywords: [__("Posts"), __("Posts block")],
		attributes: {
			numberPosts: {
				type: "string",
				default: 5
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
			categoriesList: {
				type: "string"
			}
		},

		edit: withSelect( (select, props) => {
			const { getEntityRecords } = select('core');
			const { category, order, orderBy, numberPosts } = props.attributes;
			const { postQuery } = pickBy( {
				categories: category,
				order: order,
				orderBy: orderBy,
				per_page: numberPosts
			}, (value) => !undefined(value) );

			const {cate_lists_query} = {
				per_page: 100
			};
			return {
				getPost: getEntityRecords( 'postType', 'post', postQuery ),
				cateList: getEntityRecords( 'taxonomy', 'category', cate_lists_query ),
			}
		})(AdvanceBlockPosts),

		save: function() {
			return el("p", {}, __("Hello from the saved content!"));
		}
	});
})(window.wp);
